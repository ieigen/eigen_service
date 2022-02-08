import express from "express";
import PubSub from "pubsub-js";
import { Op } from "sequelize";

import * as util from "../util";
import * as db_wallet from "../model/database_wallet";
import {
  WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT,
  WalletStatusTransactionResult,
} from "../model/database_wallet";
import * as db_address from "../model/database_address";
import * as db_user from "../model/database_id";
import * as db_txh from "../model/database_transaction_history";
import * as db_wh from "../model/database_wallet_history";
import * as db_multisig from "../model/database_multisig";

// Records txid => wallet, wallet is a Sequelize model which can be used to update status
let TRANSACTION_ADD_SIGNER_BY_OWNER_MAP = new Map();
let TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP = new Map();
let TRANSACTION_DELETE_SIGNER_MAP = new Map();

function addWalletStatusSubscriber(txid, wallet_id) {
  console.log("Add wallet status subscriber: ", txid, wallet_id);
  // TRANSACTION_WALLET_MAP[txid] = wallet;

  return function (msg, transaction) {
    var [_, txid] = msg.split(".");

    db_wallet.findByWalletId(wallet_id).then((wallet) => {
      if (wallet === null) {
        console.log(`Transaction ${txid} is not related to wallet`);
        return false;
      }

      const wallet_status = wallet["dataValues"]["wallet_status"];
      const transaction_status = transaction["status"];

      console.log(
        `[addWalletStatusSubscriber]: ${txid}, ${JSON.stringify(wallet)}`
      );

      const next_status_success =
        WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT[wallet_status][
          WalletStatusTransactionResult.Success
        ];

      const next_status_fail =
        WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT[wallet_status][
          WalletStatusTransactionResult.Fail
        ];

      if (next_status_success) {
        if (transaction_status == db_txh.TransactionStatus.Success) {
          db_wh.add(
            wallet_id,
            txid,
            wallet_status,
            next_status_success,
            db_wh.StatusTransitionCause.TransactionSuccess
          );
          return wallet
            .update({
              wallet_status: next_status_success,
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
        } else if (transaction_status == db_txh.TransactionStatus.Failed) {
          db_wh.add(
            wallet_id,
            txid,
            wallet_status,
            next_status_success,
            db_wh.StatusTransitionCause.TransactionFail
          );
          return wallet
            .update({
              wallet_status: next_status_fail,
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
      }

      console.log(
        `Do not handle Transaction (${txid}) and Wallet (${wallet["dataValues"]["wallet_id"]})`
      );

      return false;
    });
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

    if (transaction.status == db_txh.TransactionStatus.Success) {
      return db_wallet.updateOrAddBySigner(data.wallet_address, data.address, {
        status: db_wallet.SignerStatus.Active,
      });
    } else {
      return db_wallet.updateOrAddBySigner(data.wallet_address, data.address, {
        status: db_wallet.SignerStatus.Rejected,
      });
    }
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
      db_wallet.WalletStatus.Creating // Wallet status is submited at first
    );

    const wallet_id = result["dataValues"]["wallet_id"];

    db_wh.add(
      wallet_id,
      txid,
      db_wallet.WalletStatus.None,
      db_wallet.WalletStatus.Creating,
      db_wh.StatusTransitionCause.Create
    );

    console.log(
      `[[addWalletStatusSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${wallet_id})`
    );

    PubSub.subscribeOnce(
      `Transaction.${txid}`,
      addWalletStatusSubscriber(txid, wallet_id)
    );

    for (let signer of signers) {
      console.log(`Add ${signer} into wallet ${wallet_id}]}`);
      db_wallet.add(
        user_id,
        name,
        wallet_address,
        signer,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        db_wallet.SignerStatus.Active, // Signers added when wallet is added do not need to be confirmed
        db_wallet.WalletStatus.None // Wallet status is meaningless for signer
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
    const txid = req.body.txid;
    const status = req.body.status;
    if (util.has_value(owner_address)) {
      if (util.has_value(txid) || util.has_value(status)) {
        console.log("owner_address cannot co-exists with txid or status");
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            "owner_address cannot co-exists with txid or status"
          )
        );
        return;
      }

      let result = await db_wallet.updateOwnerAddress(
        user_id,
        wallet_id,
        owner_address
      );

      res.json(util.Succ(result));
      return;
    } else {
      if (!util.has_value(txid) || !util.has_value(status)) {
        console.log("mising txid or status");
        res.json(util.Err(util.ErrCode.Unknown, "mising txid or status"));
        return;
      }

      let wallet = await db_wallet.findByWalletId(wallet_id);

      if (wallet === null) {
        console.log("wallet does not exist: ", wallet_id);
        res.json(util.Err(util.ErrCode.Unknown, "wallet does not exist"));
        return;
      }

      let wallet_status = wallet["dataValues"]["wallet_status"];

      if (!db_wallet.WALLET_STATUS_MACHINE_STATE_CHECK[wallet_status][status]) {
        console.log(
          `wallet status transition invalid: ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
        );
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            `wallet status transition invalid: ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
          )
        );
        return;
      }

      // Update wallet_status -> status
      if (
        status == db_wallet.WalletStatus.Freezing ||
        status == db_wallet.WalletStatus.Recovering ||
        status == db_wallet.WalletStatus.Unlocking
      ) {
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            `wallet status transition not supported now: ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
          )
        );
        return;
        // TODO:
        // db_wh.add(
        //   wallet_id,
        //   txid,
        //   wallet_status,
        //   status,
        //   db_wh.StatusTransitionCause.Freeze (and so on)
        // );
      }
      wallet.update({
        wallet_status: status,
      });

      console.log(
        `[[addWalletStatusSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${wallet}): ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
      );

      PubSub.subscribeOnce(
        `Transaction.${txid}`,
        addWalletStatusSubscriber(txid, wallet)
      );

      res.json(util.Succ(true));
      return;
    }
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

    for (let wallet of wallets) {
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
      wallet["signer_count"] = signers.length;
    }

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
      signers[i]["wallet_status"] = owner["wallet_status"];

      // Find the latest mtxid and sign_message

      let latest_mtxid =
        await db_multisig.findLatestRecoveryMtxidBySignerAddress(
          signer["address"]
        );

      if (latest_mtxid !== null) {
        console.log("Latest mtxid: ", latest_mtxid);
        signers[i]["mtxid"] = latest_mtxid["mtxid"];
        signers[i]["sign_message"] = latest_mtxid["sign_message"];
      }
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
        const name = req.body.name;
        const status = req.body.status;
        const address = req.body.address;
        const txid = req.body.txid;

        // status is undefined means add a signer
        if (status === undefined) {
          if (!util.has_value(address)) {
            console.log("address should be given");
            res.json(util.Err(util.ErrCode.Unknown, "missing fields: address"));
            return;
          }
          // Update status subscribe
          console.log(
            `[[addSignerBySignerSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${{
              wallet_address,
              address,
            }})`
          );
          PubSub.subscribeOnce(
            `Transaction.${txid}`,
            addSignerBySignerSubscriber(txid, {
              wallet_address,
              address,
            })
          );

          return res.json(util.Succ(false));
        } else {
          // Legacy: sign_message is updated and checked here
          console.log("Update signer: ", req.body);
          await db_wallet.updateOrAddBySigner(
            wallet_address,
            address,
            req.body
          );

          return res.json(util.Succ(true));
        }
      } else {
        console.log(
          `It is the owner (user_id: ${user_id}) update the signer (which belongs to wallet_id: ${wallet_id}) status`
        );
        const wallet_address = wallet["wallet_address"];
        console.log("Wallet address found: ", wallet_address);
        console.log("Req body: ", req.body);
        const name = req.body.name;
        const status = req.body.status;
        const address = req.body.address;
        const txid = req.body.txid;

        // Status is undefined means add a signer!
        if (status === undefined) {
          if (!util.has_value(address) || !util.has_value(txid)) {
            console.log("address should be given");
            res.json(
              util.Err(util.ErrCode.Unknown, "missing fields: address or txid")
            );
            return;
          }
          // Update status subscribe
          console.log(
            `[[addSignerByOwnerSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${{
              user_id,
              wallet_address,
              address,
            }})`
          );

          PubSub.subscribeOnce(
            `Transaction.${txid}`,
            addSignerByOwnerSubscriber(txid, {
              user_id,
              wallet_address,
              address,
            })
          );

          return res.json(util.Succ(false));
        } else {
          // Legacy: sign_message is updated and checked here
          console.log("Update signer: ", req.body);
          await db_wallet.updateOrAddByOwner(
            user_id,
            wallet_address,
            address,
            db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
            req.body
          );
          return res.json(util.Succ(true));
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
      const mtxid = req.query.mtxid;

      if (!util.has_value(address) || !util.has_value(mtxid)) {
        console.log("address and mtxid should be given");
        res.json(
          util.Err(util.ErrCode.Unknown, "missing fields: address or mtxid")
        );
        return;
      }

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

      let all_recover_signers = await db_wallet.findAll({
        where: {
          wallet_address: wallet_address,
          role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          status: {
            [Op.gte]: db_wallet.SignerStatus.StartRecover,
          },
        },
        raw: true,
      });

      // Check if the signers is greater than 1/2
      const sign_messages = await db_multisig.getRecoverySignMessages(mtxid);

      if (sign_messages.length >= all_recover_signers.length / 2) {
        let sigs = db_multisig.getSignatures(sign_messages);
        console.log("The recover sign_message could be return: ", sigs);
        return res.json(util.Succ(sigs));
      } else {
        return res.json(util.Succ(""));
      }
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
        `[[addDeleteSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${{
          wallet_address,
          address,
        }})`
      );

      PubSub.subscribeOnce(
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
