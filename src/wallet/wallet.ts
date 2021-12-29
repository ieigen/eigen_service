import express from "express";
import * as util from "../util";
import * as ecies from "../crypto/ecies";
import * as db_wallet from "../model/database_wallet";
import * as db_address from "../model/database_address";
import * as db_user from "../model/database_id";

import { Op } from "sequelize";

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
    if (!util.has_value(address) || !util.has_value(name)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    console.log(req.body);

    const result = await db_wallet.add(
      user_id,
      name,
      wallet_address,
      address,
      db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      db_wallet.SINGER_TYPE_NONE,
      ""
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
        db_wallet.SINGER_TYPE_TO_BE_CONFIRMED,
        ""
      );
    }
    res.json(util.Succ(result));
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

    console.log(req.query);

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

    console.log(wallets);

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
      "wallet_id",
    ];

    let filter;

    if (address !== undefined) {
      filter = {
        address: address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      };
    } else {
      let address_map_array: any = await db_address.findAll({ user_id });
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

      let wallet = await db_wallet.findWalletById(user_id, wallet_id);

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

      const wallet_address = wallet["dataValues"]["wallet_address"];
      console.log("Wallet address found: ", wallet_address);
      console.log("Req body: ", req.body);
      const sign_message = req.body.sign_message;
      const name = req.body.name;
      const status = req.body.status;
      const address = req.body.address;

      if (status !== undefined) {
        if (!util.has_value(address)) {
          console.log("address should be given");
          res.json(util.Err(util.ErrCode.Unknown, "missing fields: address"));
          return;
        }
        // Update status
        const result = await db_wallet.updateOrAdd(
          user_id,
          wallet_address,
          address,
          db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          {
            status,
          }
        );
        return res.json(util.Succ(result));
      } else {
        console.log("Update signer: ", req.body);
        const result = await db_wallet.updateOrAdd(
          user_id,
          wallet_address,
          address,
          db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          req.body
        );
        return res.json(util.Succ(result));
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

      let wallet_address = wallet["dataValues"]["wallet_address"];

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

      let wallet = await db_wallet.findWalletById(user_id, wallet_id);

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

      const wallet_address = wallet["dataValues"]["wallet_address"];

      console.log("Wallet address found: ", wallet_address);

      const address = req.body.address;

      if (!util.has_value(address)) {
        return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
      }

      const result = await db_wallet.remove(
        wallet_address,
        address,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER
      );
      console.log(result);
      res.json(util.Succ(result));
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
          let found_user_id = row["dataValues"]["user_id"];
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
          return row["dataValues"]["address"];
        });

      res.json(util.Succ([addresses]));
      return;
    }
  });
};
