// metamask.ts
/**
 * Provide metamask related login processes
 *
 * @module login
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import jsonwebtoken from "jsonwebtoken";
import * as crypto from "crypto";
import consola from "consola";
import "dotenv/config";
import { ethers } from "ethers";

import { Session } from "../session";

import * as util from "../util";
import * as userdb from "../model/database_id";
import * as addressdb from "../model/database_address";

util.require_env_variables([
  "SERVER_ROOT_URI",
  "JWT_SECRET",
  "COOKIE_NAME",
  "UI_ROOT_URI",
]);

const NONCE_MAP = new Map();

async function getAuthMetamask(req, res) {
  consola.info(
    "Going to query a nonce to login with address",
    req.query.address
  );

  const address = req.query.address;

  if (!util.has_value(address)) {
    consola.error("address shoule be given");
    res.json(util.Err(util.ErrCode.InvalidAuth, "address shoule be given"));
    return;
  }

  const nonce = crypto.randomBytes(32).toString("base64");

  NONCE_MAP.set(address, nonce);

  return res.json(util.Succ(nonce));
}

async function postAuthMetamask(req, res) {
  const signature = req.query.signature;
  const address = req.query.address;

  // email here is a fake one
  const email = req.query.email;
  consola.info(`Going to verify a nonce ${signature} with addredd ${address}`);

  // Fetch the user's profile with the access token and bearer
  if (!util.has_value(signature) || !util.has_value(address)) {
    consola.error("signature and address shoule be given");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "signature and address shoule be given"
      )
    );
    return;
  }

  const nonce = NONCE_MAP.get(address);
  NONCE_MAP.delete(address);

  if (!util.has_value(nonce)) {
    consola.error("a nonce should be generated first");
    res.json(
      util.Err(util.ErrCode.InvalidAuth, "a nonce should be generated first")
    );
    return;
  }

  const sign_address = ethers.utils.verifyMessage(nonce, signature);

  if (sign_address === address) {
    // Verified!
    consola.success("Verfied with address ", address);

    const address_record: any = await addressdb.findOne({ address });
    let isNew = 0;
    let user_id;

    if (address_record) {
      // Address is associated with a UID,
      // which means the user logged in before
      user_id = address_record.id;
    } else {
      if (!util.has_value(email)) {
        consola.error("a fake email should be given");
        res.json(
          util.Err(util.ErrCode.InvalidAuth, "a fake email should be given")
        );
        return;
      }
      isNew = 1;
      const user_info = {
        kind: userdb.UserKind.METAMASK,
        email: email,
        name: "",
        given_name: "",
        family_name: "",
        unique_id: "",
        picture: "",
        locale: "",
        verified_email: "",
        secret: "",
      };
      const result = await user_info;
      consola.log("update", result);
      user_id = result["user_id"];
    }

    const user_info = await userdb.findByID(user_id);
    const token = jsonwebtoken.sign(user_info, process.env.JWT_SECRET);
    consola.log("user cookie", token);
    const hash = crypto.createHash("sha256");
    const hashcode = hash.update(token).digest("hex");
    consola.log(hashcode);
    Session.add_token(hashcode, new Session.session(token, 3600));
    res.redirect(
      `${process.env.UI_ROOT_URI}?id=${user_id}&${process.env.COOKIE_NAME}=${hashcode}&new=${isNew}`
    );
  } else {
    // Fail to verify
    consola.error("Failed to login due to fail to verification");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "failed to login due to fail to verification"
      )
    );
    return;
  }
}

module.exports = function (app) {
  app.get("/auth/metamask", getAuthMetamask);

  app.post("/auth/metamask", postAuthMetamask);
};
