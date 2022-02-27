// app.ts
/**
 * The entry point for eigen_service
 *
 * @module main
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import express from "express";
import jwt from "express-jwt";
import cors from "cors";
import consola from "consola";
import "dotenv/config";

import * as log4js from "./log";
import * as util from "./util";
import { Session } from "./session";

import * as service from "./service";

import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(log4js.useLog());
const issueOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(issueOptions));

util.require_env_variables(["JWT_SECRET"]);

const filterFunc = function (req) {
  if (process.env.DEBUG_MODE) {
    return true;
  }
  consola.info(req.url);
  const bypass = [
    "/auth/google/url",
    "/stores",
    "/store",
    "/txhs",
    "/auth/metamask",
  ];
  consola.info(bypass.indexOf(req.url), req.method);
  if (bypass.indexOf(req.url) >= 0 && req.method == "GET") {
    return true;
  }
  return false;
};

app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      consola.info(req.headers);
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return Session.check_token(req.headers.authorization.split(" ")[1]);
      } else if (req.query && req.query.token) {
        return Session.check_token(req.query.token);
      }
      return null;
    },
  }).unless(filterFunc)
);

app.get("/stores", service.getStores);

app.get("/store", service.getStore);

// add new key
app.post("/store", service.postStore);

// update
app.put("/store", service.putStore);

// get recovery data
app.get("/recovery", service.getRecovery);

// get recovery data
app.delete("/recovery", service.deleteRecovery);

app.post("/recovery", service.postRecovery);

app.get("/txhs", service.getTxhs);

app.get("/txh", service.getTxh);

// add transaction
app.post("/txh", service.postTxh);

// update transaction status
app.put("/txh/:txid", service.putTxh);

// add meta
app.post("/mtx/meta", service.postMeta);

// update txid
app.put("/mtx/meta", service.putMeta);

app.get("/mtx/meta/:id", service.getMeta);

// add sign message
app.post("/mtx/sign", service.postSign);

// query sign message
app.get("/mtx/sign/:mtxid", service.getSign);

// get user, his/her friends, his/her strangers by id
app.get("/user/:user_id", service.getUser);

// TODO: Just for test
// app.post("/user", service.postUser);

// Guardian add
app.post("/user/:user_id/guardian", service.postGuardian);

// Guardian confirm or reject
app.put("/user/:user_id/guardian", service.putGuardian);

// Guardian add
app.delete("/user/:user_id/guardian", service.deleteGuardian);

app.put("/user/:user_id/otpauth", service.putOtpauth);

// verify code
app.post("/user/:user_id/otpauth", service.postOtpauth);

// Statistics
app.get("/user/:user_id/statistics", service.getStatistics);

app.post("/user/:user_id/allowance", service.postAllowance);

app.get("/user/:user_id/allowance", service.getAllowance);

app.get("/user/:user_id/allowances", service.getAllowances);

app.post("/user/:user_id/address", service.postAddress);

app.get("/user/:user_id/addresses", service.getAddresses);

app.get("/user/:user_id/friends_addresses", service.getFriendsAddresses);

require("./login/google")(app);
require("./login/metamask")(app);
require("./relay/relay")(app);
require("./wallet/wallet")(app);
require("./message")(app);

app.listen(3000, function () {
  consola.log("Eigen Service listening on port 3000!");
});
