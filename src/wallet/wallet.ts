import express from "express";
import PubSub from "pubsub-js";
import { Op } from "sequelize";

import * as util from "../util";
import * as db_wallet from "../model/database_wallet";
import * as db_address from "../model/database_address";
import * as db_user from "../model/database_id";
import * as db_txh from "../model/database_transaction_history";

// Records txid => wallet, wallet is a Sequelize model which can be used to update status
let TRANSACTION_WALLET_MAP = new Map();
let TRANSACTION_ADD_SIGNER_BY_OWNER_MAP = new Map();
let TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP = new Map();
let TRANSACTION_DELETE_SIGNER_MAP = new Map();

function addWalletStatusSubscriber(txid, wallet) {
  console.log("Add wallet status subscriber: ", txid, wallet);
  TRANSACTION_WALLET_MAP[txid] = wallet;
  return function (msg, transaction) {
    var [_, txid] = msg.split(".");

    let wallet = TRANSACTION_WALLET_MAP[txid];
    if (wallet === undefined) {
      console.log(`Transaction ${txid} is not related to wallet`);
      return false;
    }

    const wallet_status = wallet["dataValues"]["wallet_status"];
    const transaction_status = transaction["status"];

    console.log(`[addWalletStatusSubscriber]: ${txid}, ${wallet}`);

    if (
      wallet_status == db_wallet.WalletStatus.Submitted &&
      transaction_status == db_txh.TransactionStatus.Success
    ) {
      return wallet
        .update({
          wallet_status: db_wallet.WalletStatus.CreatedSuccess,
        })
        .then(function (result) {
          console.log(
            "Update wallet status success: " + JSON.stringify(result)
          );
          return true;
        })
        .catch(function (err) {
          console.log("Update wallet status error: " + err);
          return false;
        });
    }

    console.log(
      `Do not handle Transaction (${txid}) and Wallet (${wallet["dataValues"]["wallet_id"]})`
    );

    return false;
  };
}

function addSignerByOwnerSubscriber(txid, data) {
  console.log("Add signer by owner add subscriber: ", txid, data);
  TRANSACTION_ADD_SIGNER_BY_OWNER_MAP[txid] = data;
  return function (msg, transaction) {
    var [_, txid] = msg.split(".");

    let signer_data = TRANSACTION_ADD_SIGNER_BY_OWNER_MAP[txid];
    if (signer_data === undefined) {
      console.log(`Transaction ${txid} is not related to signer`);
      return false;
    }

    const transaction_status = transaction["status"];

    console.log(`[addSignerByOwnerSubscriber]: ${txid}, ${data}`);

    if (data.status == db_wallet.SignerStatus.ToBeConfirmed) {
      if (transaction.status == db_txh.TransactionStatus.Success) {
        return db_wallet.updateOrAddByOwner(
          data.user_id,
          data.wallet_address,
          data.address,
          db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          {
            status: db_wallet.SignerStatus.Active,
          }
        );
      } else {
        return db_wallet.updateOrAddByOwner(
          data.user_id,
          data.wallet_address,
          data.address,
          db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          {
            status: db_wallet.SignerStatus.Rejected,
          }
        );
      }
    }

    console.log(
      `Do not handle Transaction (${txid}) and Signer by owner (${data.user_id})`
    );

    return false;
  };
}

function addSignerBySignerSubscriber(txid, data) {
  console.log("Add signer by signer add subscriber: ", txid, data);
  TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP[txid] = data;
  return function (msg, transaction) {
    var [_, txid] = msg.split(".");

    let signer_data = TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP[txid];
    if (signer_data === undefined) {
      console.log(`Transaction ${txid} is not related to signer`);
      return false;
    }

    const transaction_status = transaction["status"];

    console.log(`[addSignerBySignerSubscriber]: ${txid}, ${data}`);

    if (data.status == db_wallet.SignerStatus.ToBeConfirmed) {
      if (transaction.status == db_txh.TransactionStatus.Success) {
        return db_wallet.updateOrAddBySigner(
          data.wallet_address,
          data.address,
          { status: db_wallet.SignerStatus.Active }
        );
      } else {
        return db_wallet.updateOrAddBySigner(
          data.wallet_address,
          data.address,
          { status: db_wallet.SignerStatus.Rejected }
        );
      }
    }

    console.log(
      `Do not handle Transaction (${txid}) and Signer by signer (address: ${data.address})`
    );

    return false;
  };
}

function addDeleteSubscriber(txid, data) {
  console.log("Delete signer by signer add subscriber: ", txid, data);
  TRANSACTION_DELETE_SIGNER_MAP[txid] = data;
  return function (msg, transaction) {
    var [_, txid] = msg.split(".");

    let signer_data = TRANSACTION_DELETE_SIGNER_MAP[txid];
    if (signer_data === undefined) {
      console.log(`Transaction ${txid} is not related to signer`);
      return false;
    }

    const transaction_status = transaction["status"];

    if (transaction_status == db_txh.TransactionStatus.Success) {
      console.log(
        `Going to remove: wallet_address: ${data.wallet_address}, address: ${data.address}`
      );
      return db_wallet.remove(
        data.wallet_address,
        data.address,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER
      );
    } else {
      console.log(
        `Fail to remove: wallet_address: ${data.wallet_address}, address: ${data.address}, mark it rejected`
      );
      return db_wallet.updateOrAddBySigner(data.wallet_address, data.address, {
        status: db_wallet.SignerStatus.Rejected,
      });
    }
  };
}

module.exports = function (app) {
  app.post("/user/:user_id/wallet", async function (req, res) {
    const user_id = req.params.user_id;
    if (!util.check_user_id(req, user_id)) {
      console.log("user_id does not match with decoded JWT");
      res.json(
        util.Err(
          util.ErrCode.InvalidAuth,
          "user_id does not match, you can't see any other people's information"
        )
      );
      return;
    }

    const wallet_address = req.body.wallet_address;
    const address = req.body.address;
    const name = req.body.name;
    const ens = req.body.ens || "";
    const signers = req.body.signers;
    const txid = req.body.txid;
    if (
      !util.has_value(address) ||
      !util.has_value(name) ||
      !util.has_value(txid)
    ) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    console.log(req.body);

    const result = await db_wallet.add(
      user_id,
      name,
      wallet_address,
      address,
      db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      db_wallet.SignerStatus.None,
      db_wallet.WalletStatus.Submitted, // Wallet status is submited at first
      ""
    );

    console.log(
      `[[addWalletStatusSubscriber]]: PubSub.subscribe(Transaction.${txid}, ${result})`
    );

    PubSub.subscribe(
      `Transaction.${txid}`,
      addWalletStatusSubscriber(txid, result)
    );

    for (let signer of signers) {
      console.log(
        `Add ${signer} into wallet ${result["dataValues"]["wallet_id"]}`
      );
      await db_wallet.add(
        user_id,
        name,
        wallet_address,
        signer,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        db_wallet.SignerStatus.Active, // Signers added when wallet is added do not need to be confirmed
        db_wallet.WalletStatus.None, // Wallet status is meaningless for signer
        ""
      );
    }
    res.json(util.Succ(result));
  });

  app.post("/user/:user_id/wallet/:wallet_id", async function (req, res) {
    const user_id = req.params.user_id;
    const wallet_id = req.params.wallet_id;
    if (!util.check_user_id(req, user_id)) {
      console.log("user_id does not match with decoded JWT");
      res.json(
        util.Err(
          util.ErrCode.InvalidAuth,
          "user_id does not match, you can't see any other people's information"
        )
      );
      return;
    }

    let wallet = await db_wallet.findOwnerWalletById(user_id, wallet_id);

    if (wallet === null) {
      console.log(
        `The wallet (${wallet_id}) does not belong to (user_id: ${user_id})`
      );
      res.json(
        util.Err(
          util.ErrCode.Unknown,
          `The wallet (${wallet_id}) does not belong to (user_id: ${user_id})`
        )
      );
      return;
    }

    const owner_address = req.body.owner_address;
    if (owner_address === undefined) {
      console.log("owner_address should be given");
      res.json(util.Err(util.ErrCode.Unknown, "owner_address should be given"));
      return;
    }

    let result = await db_wallet.updateOwnerAddress(
      user_id,
      wallet_id,
      owner_address
    );

    res.json(util.Succ(result));
    return;
  });

  app.get("/user/:user_id/wallets", async function (req, res) {
    const user_id = req.params.user_id;
    if (!util.check_user_id(req, user_id)) {
      console.log("user_id does not match with decoded JWT");
      res.json(
        util.Err(
          util.ErrCode.InvalidAuth,
          "user_id does not match, you can't see any other people's information"
        )
      );
      return;
    }

    console.log("Query wallets with ", req.query);

    const address = req.query.address;

    let filter;

    if (address !== undefined) {
      filter = {
        address: address,
        user_id: user_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      };
    } else {
      filter = {
        user_id: user_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      };
    }

    let wallets: any = await db_wallet.findAll(filter);

    console.log("Find wallets: ", wallets);

    res.json(util.Succ(wallets));
    return;
  });

  app.get("/user/:user_id/as_signers", async function (req, res) {
    const user_id = req.params.user_id;
    if (!util.check_user_id(req, user_id)) {
      console.log("user_id does not match with decoded JWT");
      res.json(
        util.Err(
          util.ErrCode.InvalidAuth,
          "user_id does not match, you can't see any other people's information"
        )
      );
      return;
    }

    console.log(req.query);

    let address = req.query.address;
    let arttributes = [
      "createdAt",
      "updatedAt",
      "name",
      "address",
      "status",
      "wallet_address",
    ];

    let filter;

    if (address !== undefined) {
      filter = {
        address: address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      };
    } else {
      let address_map_array: any = await db_address.findAll({ user_id });
      // TODO: This may effect other interface, we could use "raw" search
      let addresses = address_map_array.map(
        (a) => a["dataValues"]["user_address"]
      );

      console.log("Find all addresses: ", addresses);

      filter = {
        address: {
          [Op.in]: addresses,
        },
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      };
    }

    let signers = await db_wallet.search({
      attributes: arttributes,
      where: filter,
      raw: true,
    });

    console.log(signers);

    for (let i = 0; i < signers.length; i++) {
      let signer = signers[i];
      let wallet_address = signer["wallet_address"];
      let owner = await db_wallet.findOne({
        wallet_address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });
      let owner_address = owner["address"];
      signers[i]["owner_address"] = owner_address;
      signers[i]["wallet_id"] = owner["wallet_id"];
    }

    res.json(util.Succ(signers));
    return;
  });

  app.post(
    "/user/:user_id/wallet/:wallet_id/signer",
    async function (req, res) {
      const user_id = req.params.user_id;
      const wallet_id = req.params.wallet_id;
      if (!util.check_user_id(req, user_id)) {
        console.log("user_id does not match with decoded JWT");
        res.json(
          util.Err(
            util.ErrCode.InvalidAuth,
            "user_id does not match, you can't see any other people's information"
          )
        );
        return;
      }

      let wallet = await db_wallet.findOwnerWalletById(user_id, wallet_id);

      if (wallet === null) {
        console.log(
          `It is the signer (user_id: ${user_id}) update the signer (which belongs to wallet_id: ${wallet_id}) status`
        );

        let found_wallet = await db_wallet.findOne({
          wallet_id,
          role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
        });

        if (found_wallet === null) {
          console.log("wallet does not exist: ", wallet_id);
          res.json(util.Err(util.ErrCode.Unknown, "wallet does not exist"));
          return;
        }

        const wallet_address = found_wallet["wallet_address"];
        console.log("Wallet address found: ", wallet_address);
        console.log("Req body: ", req.body);
        const sign_message = req.body.sign_message;
        const name = req.body.name;
        const status = req.body.status;
        const address = req.body.address;
        const txid = req.body.txid;

        if (status !== undefined) {
          if (!util.has_value(address)) {
            console.log("address should be given");
            res.json(util.Err(util.ErrCode.Unknown, "missing fields: address"));
            return;
          }
          // Update status subscribe
          console.log(
            `[[addSignerBySignerSubscriber]]: PubSub.subscribe(Transaction.${txid}, ${{
              wallet_address,
              address,
              status,
            }})`
          );
          PubSub.subscribe(
            `Transaction.${txid}`,
            addSignerBySignerSubscriber(txid, {
              wallet_address,
              address,
              status,
            })
          );

          return res.json(util.Succ(false));
        } else {
          console.log("Update signer: ", req.body);
          await db_wallet.updateOrAddBySigner(
            wallet_address,
            address,
            req.body
          );
          const result = await db_wallet.checkSingers(wallet_id);
          return res.json(util.Succ(result));
        }
      } else {
        console.log(
          `It is the owner (user_id: ${user_id}) update the signer (which belongs to wallet_id: ${wallet_id}) status`
        );
        const wallet_address = wallet["wallet_address"];
        console.log("Wallet address found: ", wallet_address);
        console.log("Req body: ", req.body);
        const sign_message = req.body.sign_message;
        const name = req.body.name;
        const status = req.body.status;
        const address = req.body.address;
        const txid = req.body.txid;

        if (status !== undefined) {
          if (!util.has_value(address) || !util.has_value(txid)) {
            console.log("address should be given");
            res.json(
              util.Err(util.ErrCode.Unknown, "missing fields: address or txid")
            );
            return;
          }
          // Update status subscribe
          console.log(
            `[[addSignerByOwnerSubscriber]]: PubSub.subscribe(Transaction.${txid}, ${{
              user_id,
              wallet_address,
              address,
              status,
            }})`
          );

          PubSub.subscribe(
            `Transaction.${txid}`,
            addSignerByOwnerSubscriber(txid, {
              user_id,
              wallet_address,
              address,
              status,
            })
          );

          return res.json(util.Succ(false));
        } else {
          console.log("Update signer: ", req.body);
          await db_wallet.updateOrAddByOwner(
            user_id,
            wallet_address,
            address,
            db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
            req.body
          );
          const result = await db_wallet.checkSingers(wallet_id);
          return res.json(util.Succ(result));
        }
      }
    }
  );

  app.get(
    "/user/:user_id/wallet/:wallet_id/sign_message",
    async function (req, res) {
      const user_id = req.params.user_id;
      const wallet_id = req.params.wallet_id;
      if (!util.check_user_id(req, user_id)) {
        console.log("user_id does not match with decoded JWT");
        res.json(
          util.Err(
            util.ErrCode.InvalidAuth,
            "user_id does not match, you can't see any other people's information"
          )
        );
        return;
      }

      const address = req.query.address;

      let wallet = await db_wallet.findOne({
        wallet_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });

      if (wallet === null) {
        console.log("wallet_id does not exist");
        res.json(util.Err(util.ErrCode.Unknown, "wallet_id does not exist"));
        return;
      }

      let wallet_address = wallet["wallet_address"];

      let signer = await db_wallet.findOne({
        wallet_address,
        address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      });

      if (signer === null) {
        console.log(
          "The signer couldn't get sign_message, because it doesn't belong to the wallet"
        );
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            "the signer couldn't get sign_message, because it doesn't belong to the wallet!"
          )
        );
        return;
      }

      console.log("Request sign_mesage for a given wallet");

      // Check if the signers is greater than
      const result = await db_wallet.checkSingers(wallet_id);

      return res.json(util.Succ(result));
    }
  );

  app.get(
    "/user/:user_id/wallet/:wallet_id/signers",
    async function (req, res) {
      const user_id = req.params.user_id;
      const wallet_id = req.params.wallet_id;
      if (!util.check_user_id(req, user_id)) {
        console.log("user_id does not match with decoded JWT");
        res.json(
          util.Err(
            util.ErrCode.InvalidAuth,
            "user_id does not match, you can't see any other people's information"
          )
        );
        return;
      }

      if (!db_wallet.isWalletBelongUser(user_id, wallet_id)) {
        console.log("wallet_id does not match with user_id");
        res.json(
          util.Err(
            util.ErrCode.InvalidAuth,
            "user_id does not match with wallet_id, you should not access any other people's wallets"
          )
        );
        return;
      }

      console.log("Request signers for a given wallet:", req.query);

      const wallet_filter = {
        wallet_id: wallet_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      };

      let wallet: any = await db_wallet.findOne(wallet_filter);

      if (wallet === null) {
        console.log("wallet does not exist");
        res.json(util.Err(util.ErrCode.InvalidAuth, "wallet does not exist"));
        return;
      }

      let wallet_address = wallet["wallet_address"];

      const singer_filter = {
        wallet_address: wallet_address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      };

      let signers: any = await db_wallet.search({
        attributes: [
          "createdAt",
          "updatedAt",
          "name",
          "address",
          "status",
          "wallet_address",
        ],
        where: singer_filter,
        raw: true,
      });

      console.log(
        `Find all signers for wallet ${wallet_id}: ${JSON.stringify(signers)}`
      );

      res.json(util.Succ(signers));
      return;
    }
  );

  app.delete(
    "/user/:user_id/wallet/:wallet_id/signer",
    async function (req, res) {
      const user_id = req.params.user_id;
      const wallet_id = req.params.wallet_id;
      if (!util.check_user_id(req, user_id)) {
        console.log("user_id does not match with decoded JWT");
        res.json(
          util.Err(
            util.ErrCode.InvalidAuth,
            "user_id does not match, you can't see any other people's information"
          )
        );
        return;
      }

      let wallet = await db_wallet.findOwnerWalletById(user_id, wallet_id);

      if (wallet === null) {
        console.log(
          `user_id (${user_id}) and wallet_id (${wallet_id}) does not own a wallet`
        );
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            `user_id (${user_id}) and wallet_id (${wallet_id}) does not own a wallet`
          )
        );
        return;
      }

      const wallet_address = wallet["wallet_address"];

      console.log("Wallet address found: ", wallet_address);

      const address = req.body.address;
      const txid = req.body.txid;

      if (!util.has_value(address) || !util.has_value(txid)) {
        return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
      }

      console.log(
        `[[addDeleteSubscriber]]: PubSub.subscribe(Transaction.${txid}, ${{
          wallet_address,
          address,
        }})`
      );

      PubSub.subscribe(
        `Transaction.${txid}`,
        addDeleteSubscriber(txid, {
          wallet_address,
          address,
        })
      );

      res.json(util.Succ(true));
    }
  );

  app.get("/user/:user_id/signers", async function (req, res) {
    const user_id = req.params.user_id;

    if (!util.check_user_id(req, user_id)) {
      console.log("user_id does not match with decoded JWT");
      res.json(
        util.Err(
          util.ErrCode.InvalidAuth,
          "user_id does not match, you can't see any other people's information"
        )
      );
      return;
    }

    console.log(req.query);

    const email = req.query.email;
    const address = req.query.ens;

    const filter_paramter_count = [email, address]
      .map(util.has_value)
      .map((x) => (x ? 1 : 0))
      .reduce((partial_sum, a) => partial_sum + a, 0);

    if (filter_paramter_count != 1) {
      return res.json(
        util.Err(
          util.ErrCode.Unknown,
          "if and only if one of email, ens, address should be given"
        )
      );
    }

    if (email !== undefined) {
      let addresses = await db_user
        .findByEmail(email)
        .then(function (row: any) {
          console.log(row);
          if (row === null) {
            return [];
          }
          let found_user_id = row["user_id"];
          console.log("Find user id: ", found_user_id);
          return db_address
            .findAll({
              where: { user_id: found_user_id },
              raw: true,
            })
            .then(function (rows: any) {
              let addresses = [];
              console.log(rows);
              for (let i = 0; i < rows.length; i++) {
                console.log(rows[i]);
                addresses.push(rows[i]["user_address"]);
              }
              return addresses;
            });
        });

      console.log(addresses);

      res.json(util.Succ(addresses));
      return;
    } else if (address !== undefined) {
      // address
      let addresses = await db_wallet
        .findOne({ address })
        .then(function (row: any) {
          console.log(row);
          if (row === null) {
            return [""];
          }
          return row["address"];
        });

      res.json(util.Succ([addresses]));
      return;
    }
  });
};
