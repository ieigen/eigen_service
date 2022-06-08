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
    const sender_public_key = req.body.sender_public_key;
    const sender_address = req.body.sender_address;
    const receiver_address = req.body.receiver_address;
    const nonce = req.body.nonce;

    if (
      !util.has_value(message) ||
      !util.has_value(sender_public_key) ||
      !util.has_value(sender_address) ||
      !util.has_value(receiver_address) ||
      !util.has_value(nonce)
    ) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }

    const result = await db_sa.add(
      message,
      sender_public_key,
      sender_address,
      receiver_address,
      nonce
    );
    res.json(util.Succ(result));
  });

  app.get("/user/stealth_address", async function (req, res) {
    consola.log(req.params);
    const message = req.params.message;
    const filter = {
      message: message,
    };
    const result = await db_sa.findAll(filter);
    consola.log(result);
    res.json(util.Succ(result));
  });

  app.put("/user/stealth_address", async function (req, res) {
    consola.log(req.body);
    const message = req.body.message;
    const status = req.body.status;
    const result = await db_sa.updateStatus(message, status);
    consola.log(result);
    res.json(util.Succ(result));
  });
};
