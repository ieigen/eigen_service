import express from "express";
import * as util from "../util";
import * as ecies from "../crypto/ecies";
import * as db_wallet from "../model/database_wallet";
import * as db_signer from "../model/database_signer";
import * as db_user from "../model/database_id";
import * as db_address from "../model/database_address";

module.exports = function (app) {
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

      const address = req.body.address;
      const name = req.body.name;
      const ens = req.body.ens || "";
      const status = req.body.status;
      const signer_id = req.body.signer_id;
      if (status !== undefined) {
        if (!util.has_value(signer_id)) {
          console.log("signer_id should be given");
          res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
          return;
        }
        const result = await db_signer.updateStatus(
          wallet_id,
          signer_id,
          status
        );
        return res.json(util.Succ(result));
      } else {
        if (!util.has_value(address) || !util.has_value(name)) {
          return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
        }

        const result = await db_signer.updateOrAdd(
          wallet_id,
          name,
          address,
          ens
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

      console.log(req.query);

      const filter = {
        wallet_id: wallet_id,
      };

      let signers: any = await db_signer.search(filter);

      console.log(signers);

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

      const signer_id = req.body.signer_id;

      if (!util.has_value(signer_id)) {
        return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
      }

      const result = await db_signer.remove(wallet_id, signer_id);
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
    const ens = req.query.ens;

    if (!util.has_value(email) && !util.has_value(ens)) {
      return res.json(
        util.Err(util.ErrCode.Unknown, "email or ens should be given")
      );
    }

    if (util.has_value(email) && util.has_value(ens)) {
      return res.json(
        util.Err(util.ErrCode.Unknown, "email and ens should be given both")
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
    } else {
      // ens
      let addresses = await db_wallet
        .findOne({ ens })
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
