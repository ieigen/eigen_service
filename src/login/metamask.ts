/**
 * Copyright 2021-2022 Eigen Network
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
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
import * as idmapdb from "../model/database_id_map";
import * as association from "../association";

util.require_env_variables([
  "SERVER_ROOT_URI",
  "JWT_SECRET",
  "COOKIE_NAME",
  "UI_ROOT_URI",
]);

const NONCE_MAP = new Map();

/**
 * Get a nonce in order to login with metamask
 *
 * @param req the request information, including these fields:
 *            1. address
 * @param res the response, if OK, it is a nonce (a 32-length base64)
 */
export async function getAuthMetamask(req, res) {
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

/**
 * Verify the signature with the previous nonce, if success, response with
 * a UID and JWT
 *
 * @param req the request information, including these fields:
 *            1. address
 *            2. email
 *            3. signature
 * @param res the response, if OK, it will redirect to a logged in page
 */
export async function postAuthMetamask(req, res) {
  const signature = req.body.signature;
  const address = req.body.address;

  // email here is a fake one
  const email = req.body.email;
  consola.info(`Going to verify a nonce ${signature} with address ${address}`);

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

  if (
    ethers.utils.getAddress(sign_address) === ethers.utils.getAddress(address)
  ) {
    // Verified!
    consola.success("Verfied with address ", address);

    const address_id_map: any = await idmapdb.findByValueAndKind(
      ethers.utils.getAddress(address),
      userdb.UserKind.METAMASK
    );

    const email_id_map: any = await idmapdb.findByValueAndKind(
      email.trim().toLowerCase(),
      userdb.UserKind.GOOGLE
    );
    let isNew = 0;
    let user_id;

    if (email_id_map) {
      consola.info("Google email existed: ", email_id_map);
      user_id = email_id_map["user_id"];
    } else if (address_id_map) {
      // Address is associated with a UID,
      // which means the user logged in before
      consola.info("Address existed: ", address_id_map);
      user_id = address_id_map["user_id"];
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
        password_hash: "",
      };
      const result = await userdb.add(user_info);
      consola.log("update", result);
      user_id = result["dataValues"]["user_id"];

      idmapdb.add({
        user_id: user_id,
        kind: userdb.UserKind.METAMASK,
        value: ethers.utils.getAddress(address),
      });
    }

    const user_info = await userdb.findByID(user_id);

    consola.info("The user id is ", user_id);

    const token = jsonwebtoken.sign(
      user_info["dataValues"],
      process.env.JWT_SECRET
    );
    consola.log("user cookie", token);
    const hash = crypto.createHash("sha256");
    const hashcode = hash.update(token).digest("hex");
    consola.log(hashcode);
    Session.add_token(hashcode, new Session.session(token, 3600));
    const redir_url = `${process.env.UI_ROOT_URI}?id=${user_id}&${process.env.COOKIE_NAME}=${hashcode}&new=${isNew}`;
    consola.log("Redirect url: ", redir_url);
    // res.redirect(redir_url);
    return res.json(util.Succ(redir_url));
  } else {
    // Fail to verify
    consola.error(
      `Failed to login due to fail to verification: ${address} != ${sign_address}`
    );
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "failed to login due to fail to verification"
      )
    );
    return;
  }
}

/**
 * Association between fake_email and Google email
 *
 * @param req the request information, including these fields:
 *            1. fake_email
 *            2. email
 * @param res the response, return true if success
 */
export async function postUserAssociation(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.log("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  const fake_email = req.body.fake_email;
  const email = req.body.email;
  consola.info(
    `Going to associate google ${email}' with fake_email '${fake_email}'`
  );

  if (!util.has_value(email) || !util.has_value(fake_email)) {
    consola.error("email and fake_email shoule be given");
    res.json(
      util.Err(util.ErrCode.InvalidAuth, "email and fake_email shoule be given")
    );
    return;
  }

  association.METAMASK_GOOGLE_ASSOCIATION_MAP.set(email, [user_id, fake_email]);

  return res.json(util.Succ(true));
}

module.exports = function (app) {
  app.get("/auth/metamask", getAuthMetamask);

  app.post("/auth/metamask", postAuthMetamask);

  app.post("/user/:user_id(\\d+)/association", postUserAssociation);
};
