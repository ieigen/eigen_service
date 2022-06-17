// stealth_address.ts
/**
 * Provide stealth_address related services
 *
 * @module stealth_address
 */

import * as db_sa from "../model/database_stealth_address";
import * as util from "../util";
import consola from "consola";

module.exports = function (app) {
  app.post("/user/stealth_address", async function (req, res) {
    consola.log(req.body);
    const message = req.body.message;
    const user_id = req.body.user_id;
    const sender_public_key = req.body.sender_public_key;
    const sender_address = req.body.sender_address;
    const stealth_public_key = req.body.stealth_public_key;
    const stealth_address = req.body.stealth_address;
    const nonce = req.body.nonce;
    const amount = req.body.amount;
    const token_name = req.body.token_name;

    if (
      !util.has_value(message) ||
      !util.has_value(user_id) ||
      !util.has_value(sender_public_key) ||
      !util.has_value(sender_address) ||
      !util.has_value(stealth_public_key) ||
      !util.has_value(stealth_address) ||
      !util.has_value(nonce) ||
      !util.has_value(amount) ||
      !util.has_value(token_name)
    ) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }

    const result = await db_sa.add(
      message,
      user_id,
      sender_public_key,
      sender_address,
      stealth_public_key,
      stealth_address,
      nonce,
      amount,
      token_name
    );
    res.json(util.Succ(result));
  });

  app.get("/user/stealth_address", async function (req, res) {
    consola.log("req", req);
    const user_id = req.query.user_id;

    if (!util.has_value(user_id)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }

    const result = await db_sa.findAllByUserID(user_id);
    consola.log(result);
    res.json(util.Succ(result));
  });

  app.put("/user/stealth_address", async function (req, res) {
    consola.log(req.body);
    const message = req.body.message;
    const status = req.body.status;
    if (!util.has_value(message) || !util.has_value(status)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    const result = await db_sa.updateStatus(message, status);
    consola.log(result);
    res.json(util.Succ(result));
  });
};
