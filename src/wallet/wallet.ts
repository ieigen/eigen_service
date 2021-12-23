import express from "express";
import * as util from "../util";
import * as ecies from "../crypto/ecies";
import * as db_wallet from "../model/database_wallet";

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

    const address = req.body.address;
    const name = req.body.name;
    const ens = req.body.ens || "";
    if (!util.has_value(address) || !util.has_value(name)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    console.log(req.body);

    const result = db_wallet.updateOrAdd(user_id, name, address, ens);
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
    };

    let wallets: any = await db_wallet.search(filter);

    console.log(wallets);

    res.json(util.Succ(wallets));
    return;
  });
};
