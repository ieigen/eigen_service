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

    const filter = {
      user_id: user_id,
      role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
    };

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

    let address_map_array: any = await db_address.findAll({ user_id });
    let addresses = address_map_array.map(
      (a) => a["dataValues"]["user_address"]
    );

    console.log("Find all addresses: ", addresses);

    let signers = await db_wallet.findAll({
      attributes: ["createdAt", "updatedAt", "name", "address", "status"],
      where: {
        user_id: user_id,
        address: {
          [Op.in]: addresses,
        },
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      },
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

      const sign_message = req.body.sign_message;
      const name = req.body.name;
      const status = req.body.status;
      const signer_address = req.body.signer_address;

      if (status !== undefined) {
        if (!util.has_value(signer_address)) {
          console.log("signer_address should be given");
          res.json(
            util.Err(util.ErrCode.Unknown, "missing fields: signer_address")
          );
          return;
        }
        const result = await db_wallet.update(wallet_id, signer_address, {
          status,
        });
        return res.json(util.Succ(result));
      } else {
        if (!util.has_value(sign_message) || !util.has_value(name)) {
          return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
        }

        const information = {
          name,
          sign_message,
        };

        const result = await db_wallet.update(wallet_id, signer_address, {
          information,
        });
        return res.json(util.Succ(result));
      }
    }
  );

  // app.get(
  //   "/user/:user_id/wallet/:wallet_id/signers",
  //   async function (req, res) {
  //     const user_id = req.params.user_id;
  //     const wallet_id = req.params.wallet_id;
  //     if (!util.check_user_id(req, user_id)) {
  //       console.log("user_id does not match with decoded JWT");
  //       res.json(
  //         util.Err(
  //           util.ErrCode.InvalidAuth,
  //           "user_id does not match, you can't see any other people's information"
  //         )
  //       );
  //       return;
  //     }

  //     if (!db_wallet.isWalletBelongUser(user_id, wallet_id)) {
  //       console.log("wallet_id does not match with user_id");
  //       res.json(
  //         util.Err(
  //           util.ErrCode.InvalidAuth,
  //           "user_id does not match with wallet_id, you should not access any other people's wallets"
  //         )
  //       );
  //       return;
  //     }

  //     console.log(req.query);

  //     const filter = {
  //       wallet_id: wallet_id,
  //       role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
  //     };

  //     let signers: any = await db_wallet.findAll(filter);

  //     console.log(signers);

  //     res.json(util.Succ(signers));
  //     return;
  //   }
  // );

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

      const signer_address = req.body.signer_address;

      if (!util.has_value(signer_address)) {
        return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
      }

      const result = await db_wallet.remove(wallet_id, signer_address);
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
