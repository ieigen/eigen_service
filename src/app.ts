import express from "express";
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
const TOTP = require("totp.js");
require("dotenv").config();

import * as log4js from "./log";
import * as db_pk from "./model/database_pk";
import * as db_txh from "./model/database_transaction_history";
import * as db_recovery from "./model/database_recovery";
import * as friend_list from "./model/database_friend_relationship";
import * as db_address from "./model/database_address";
import * as util from "./util";
import * as db_user from "./model/database_id";
import { Session } from "./session";
import * as TOKEN_CONSTANS from "./token/constants";
import * as db_allowance from "./token/allowance";
import * as db_multisig from "./model/database_multisig";
import * as db_wallet from "./model/database_wallet";

import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const logger = log4js.logger("Eigen");
app.use(log4js.useLog());
const issueOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(issueOptions));

util.require_env_variables(["JWT_SECRET"]);

let filterFunc = function (req) {
  if (process.env.DEBUG_MODE) {
    return true;
  }
  console.log(req.url);
  let bypass = ["/auth/google/url", "/stores", "/store", "/txhs"];
  console.log(bypass.indexOf(req.url), req.method);
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
      console.log(req.headers);
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

// query key
app.get("/stores", async function (req, res) {
  return res.json(util.Succ(await db_pk.findAll()));
});

app.get("/store", async function (req, res) {
  const digest = req.query.digest;
  if (!util.has_value(digest)) {
    logger.error("digest is empty");
    return res.json(util.Err(1, "digest missing"));
  }
  const result = await db_pk.findByDigest(digest);
  if (!result) {
    return res.json(util.Succ({}));
  }
  res.json(util.Succ(result));
});

// add new key
app.post("/store", async function (req, res) {
  const digest = req.body.digest;
  const pk = req.body.public_key;
  if (!util.has_value(digest) || !util.has_value(pk)) {
    return res.json(util.Err(1, "missing dig or pk"));
  }

  const result = db_pk.updateOrAdd(digest, digest, pk);
  res.json(util.Succ(result));
});

// update
app.put("/store", async function (req, res) {
  const old_digest = req.body.old_digest;
  const digest = req.body.digest;
  const pk = req.body.public_key;
  if (
    !util.has_value(digest) ||
    !util.has_value(pk) ||
    !util.has_value(old_digest)
  ) {
    return res.json(util.Err(1, "missing dig or pk"));
  }
  const result = db_pk.updateOrAdd(old_digest, digest, pk);
  res.json(util.Succ(result));
});

/*
app.get("/txhs", async function(req, res) {
    return res.json(util.Succ(await db_txh.findAll()))
})
*/

// get recovery data
app.get("/recovery", async function (req, res) {
  console.log(JSON.stringify(req.query));
  const user_id = req.query.user_id;
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

  const result = await db_recovery.findByUserID(user_id);
  console.log(result);
  res.json(util.Succ(result));
});

// get recovery data
app.delete("/recovery", async function (req, res) {
  console.log(JSON.stringify(req.query));
  const id = req.body.id;

  if (!util.check_user_id(req, id)) {
    console.log("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  const result = await db_recovery.remove(id);
  console.log(result);
  res.json(util.Succ(result));
});

app.post("/recovery", async function (req, res) {
  console.log(JSON.stringify(req.body));
  const user_id = req.body.user_id;
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
  const name = req.body.name;
  const desc = req.body.desc;
  const total_shared_num = req.body.total_shared_num;
  const threshold = req.body.threshold;
  const friends = req.body.friends;

  if (user_id === undefined) {
    res.json(util.Err(util.ErrCode.Unknown, "missing user_id"));
    return;
  }
  const result = await db_recovery.add(
    user_id,
    name,
    desc,
    total_shared_num,
    threshold,
    JSON.stringify(friends)
  );
  console.log(result);
  res.json(util.Succ(result));
});

app.get("/txhs", async function (req, res) {
  const action = req.query.action;
  console.log(req.query);

  const page = req.query.page;
  const page_size = req.query.page_size;
  const order = req.query.order;
  const address = req.query.address;
  let allow_fileds = {
    from: req.query.from,
    to: req.query.to,
    txid: req.query.txid,
    network_id: req.query.network_id,
    from_type: req.query.from_type,
    to_network_id: req.query.to_network_id,
    block_num: req.query.block_num,
    operation: req.query.operation,
  };

  let filter = Object.keys(allow_fileds)
    .filter(
      (key) => allow_fileds[key] !== null && allow_fileds[key] !== undefined
    )
    .reduce((acc, key) => ({ ...acc, [key]: allow_fileds[key] }), {});
  let result;
  switch (action) {
    case "search":
      result = await db_txh.search(filter, page, page_size, order);
      break;
    case "search_l2":
      filter["type"] = [db_txh.TX_TYPE_L2ToL1, db_txh.TX_TYPE_L2ToL2];
      result = await db_txh.search(filter, page, page_size, order);
      break;
    case "search_both_sides":
      const from = req.query.from;
      const to = req.query.to;
      const address = req.query.address;

      //   if (
      //     !util.has_value(address) ||
      //     util.has_value(from) ||
      //     util.has_value(to)
      //   ) {
      //     res.json(
      //       util.Err(
      //         util.ErrCode.Unknown,
      //         "wrong search pattern for both sized, address should be given, neither from or to should not be given"
      //       )
      //     );
      //     return;
      //   }

      //   filter["address"] = address;

      //   result = await db_txh.search_both_sizes(filter, page, page_size, order);
      //   break;
      // case "search_multisig":
      if (
        !util.has_value(address) ||
        util.has_value(from) ||
        util.has_value(to)
      ) {
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            "wrong search pattern for both sized, address should be given, neither from or to should not be given"
          )
        );
        return;
      }

      // Firstly, the address as an owner,
      let wallet = await db_wallet.findOne({
        address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });

      if (wallet !== null) {
        result = await db_txh.search(
          { from: wallet["wallet_address"] },
          0, // Disable return with page group
          page_size,
          order
        );
      }

      // Secondly, the address as a signer, and the status is "Creating"

      let signers = await db_wallet.search({
        where: {
          address: address,
          role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        },
        raw: true,
      });

      for (let signer of signers) {
        var txhs = await db_txh.search(
          {
            from: signer["address"],
            status: db_txh.TransactionStatus.Creating,
          },
          0, // Disable return with page group
          page_size,
          order
        );

        result = result.concat(txhs);
      }

      // TODO: Page

      break;
    default:
      return res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
  }

  //OPT: use batch
  let transactions = result["transactions"];
  for (var i = 0; i < transactions.length; i++) {
    let txid = transactions[i]["txid"];
    if (!util.has_value(txid)) continue;
    let res = await db_multisig.findMultisigMetaByConds({ txid: txid });
    if (res == null) continue;
    if (!util.has_value(res["id"])) continue;
    transactions[i]["mtxid"] = res["id"];
  }
  console.log(transactions);
  result["transactions"] = transactions;
  return res.json(util.Succ(result));
});

app.get("/txh", async function (req, res) {
  const action = req.query.action;
  console.log("action = ", action);
  if (!action) {
    const txid = req.query.txid;
    if (!util.has_value(txid)) {
      logger.error("txid is empty");
      return res.json(util.Err(util.ErrCode.Unknown, "txid missing"));
    }
    const result = await db_txh.getByTxid(txid);
    if (!result) {
      return res.json(util.Succ({}));
    }
    res.json(util.Succ(result));
  } else {
    switch (action) {
      case "transaction_count_l2":
        return res.json(util.Succ(await db_txh.transaction_count_l2()));
        break;
      case "account_count_l2":
        return res.json(util.Succ(await db_txh.account_count_l2()));
        break;
      default:
        return res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
        break;
    }
  }
});

// add transaction
app.post("/txh", async function (req, res) {
  const txid = req.body.txid;
  const from = req.body.from;
  const to = req.body.to;
  const value = req.body.value;
  const block_num = req.body.block_num;
  const type = req.body.type;
  const name = req.body.name;
  const network_id = req.body.network_id;
  const to_network_id = req.body.to_network_id;
  const operation = req.body.operation;
  if (
    !util.has_value(txid) ||
    !util.has_value(network_id) ||
    !util.has_value(from) ||
    !util.has_value(value) ||
    !util.has_value(to) ||
    !util.has_value(operation) ||
    !util.has_value(type)
  ) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }

  if (type == db_txh.TX_TYPE_L1ToL2 || type == db_txh.TX_TYPE_L2ToL1) {
    if (!util.has_value(to_network_id)) {
      return res.json(
        util.Err(
          util.ErrCode.Unknown,
          "missing fields, cross chain transaction should set 'to_network_id'"
        )
      );
    }
  }
  console.log(req.body);

  const result = db_txh.updateOrAdd(txid, {
    txid,
    network_id,
    from,
    to_network_id,
    to,
    value,
    type: Number(type),
    name: name || "ETH",
    block_num: req.body.block_num || -1,
    status: req.body.status || 0,
    sub_txid: req.body.sub_txid || "",
    operation,
  });
  res.json(util.Succ(result));
});

// update transaction status
app.put("/txh/:txid", async function (req, res) {
  const txid = req.params.txid;
  if (!util.has_value(txid)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }
  const result = db_txh.updateOrAdd(txid, {
    status: req.body.status || 0,
    sub_txid: req.body.sub_txid || "",
  });
  res.json(util.Succ(result));
});

// add meta
app.post("/mtx/meta", async (req, res) => {
  let ret = await db_multisig.addMultisigMeta(
    req.body.network_id,
    req.body.user_id,
    req.body.wallet_address,
    req.body.to,
    req.body.value,
    req.body.data
  );
  res.json(util.Succ(ret));
});

// update txid
app.put("/mtx/meta", async (req, res) => {
  if (!util.has_value(req.body.id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'id'"));
  }
  let ret = await db_multisig.updateMultisigMeta(req.body.id, req.body.txid);
  res.json(util.Succ(ret));
});

app.get("/mtx/meta/:id", async (req, res) => {
  if (!util.has_value(req.params.id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'id'"));
  }
  let ret = await db_multisig.findMultisigMetaByConds({ id: req.params.id });
  // return owner_address and mtx status
  let mtx = await db_txh.getByTxid(ret["txid"]);
  if (mtx != null) {
    ret["status"] = mtx["status"];
  }

  let walletInfo = await db_wallet.findOne({
    wallet_address: ret["wallet_address"],
  });
  if (walletInfo != null) {
    ret["owner_address"] = walletInfo["address"];
  }
  res.json(util.Succ(ret));
});

// add sign message
app.post("/mtx/sign", async (req, res) => {
  if (!util.has_value(req.body.mtxid)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'mtxid'"));
  }
  let ret = await db_multisig.addSignMessage(
    req.body.mtxid,
    req.body.signer_address,
    req.body.signer_message,
    req.body.status
  );
  res.json(util.Succ(ret));
});

// query sign message
app.get("/mtx/sign/:mtxid", async (req, res) => {
  if (!util.has_value(req.params.mtxid)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'mtxid'"));
  }
  let sm = await db_multisig.findSignHistoryByMtxid(req.params.mtxid);
  console.log("signed message", sm);
  let resultsm = [];
  // get all sigers
  let meta = await db_multisig.findMultisigMetaByConds({
    id: req.params.mtxid,
  });
  console.log("meta", meta);
  if (meta == null) {
    return res.json(util.Succ(sm));
  }
  let allSigners = await db_wallet.findAll({
    wallet_address: meta["wallet_address"],
  });
  console.log(allSigners);
  let signedSigners = new Map<string, boolean>();

  if (sm !== null) {
    for (var i = 0; i < sm.length; i++) {
      // get user_id
      let signInfo = {};
      let addrInfo = await db_address.findOne({
        user_address: sm[i]["signer_address"],
      });
      signedSigners.set(sm[i]["signer_address"], true);
      if (addrInfo == null) continue;
      let userInfo = await db_user.findByID(addrInfo["user_id"]);
      if (userInfo == null) continue;

      signInfo["name"] = userInfo["name"];
      signInfo["picture"] = userInfo["picture"];
      signInfo["id"] = i;
      signInfo["mtxid"] = req.params.mtxid;
      signInfo["signer_address"] = sm[i]["signer_address"];
      signInfo["sign_message"] = null;
      //signInfo["createAt"] = sm[i]["createAt"]
      //signInfo["updateAt"] = sm[i]["updateAt"]
      resultsm.push(signInfo)
    }

    let signedSize = resultsm.length;
    for (var i = 0; i < allSigners.length; i++) {
      let signer = allSigners[i];
      if (signedSigners.has(signer["address"])) {
        continue;
      }

      // FIXME very tricky
      let signInfo = {};
      if (resultsm.length > 0) signInfo = resultsm[resultsm.length - 1];
      signInfo["id"] = i + signedSize;
      signInfo["mtxid"] = req.params.mtxid;
      signInfo["signer_address"] = signer["address"];
      signInfo["sign_message"] = null;

      let addrInfo = await db_address.findOne({
        user_address: signer["address"],
      });
      signedSigners.set(signer["address"], true);
      if (addrInfo == null) continue;
      let userInfo = await db_user.findByID(addrInfo["user_id"]);
      if (userInfo == null) continue;

      signInfo["name"] = userInfo["name"];
      signInfo["picture"] = userInfo["picture"];
      resultsm.push(signInfo);
    }
  }

  // get the unsigned signer info
  return res.json(util.Succ(resultsm));
});

// get user, his/her friends, his/her strangers by id
app.get("/user/:user_id", async function (req, res) {
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
  const action = req.query.action;

  if (action === undefined) {
    const result = await db_user.findByID(user_id);
    console.log(result);
    res.json(util.Succ(result));
    return;
  }

  switch (action) {
    case "guardians":
      var filter_status = req.query.status;
      if (filter_status !== undefined) {
        console.log("Filter the status of guardians: ", filter_status);
      }
      if (user_id === undefined) {
        var all_relationships = await friend_list.findAll();
        res.json(util.Succ(all_relationships));
        return;
      }
      if (!(await db_user.findByID(user_id))) {
        console.log("The user does not exist ", user_id);
        res.json(util.Err(util.ErrCode.Unknown, "user does not exist"));
        return;
      }
      var status = await friend_list.getStatusByUserId(user_id);
      var ids = new Set();
      var relationships = new Map();
      for (let i = 0; i < status.length; i++) {
        // There isn't status filter or filter the status
        if (filter_status === undefined || filter_status == status[i].status) {
          ids.add(status[i].user_id);
          relationships[status[i].user_id] = status[i].status;
        }
      }
      console.log(status, ids);
      var information_without_status: any = await db_user.findUsersInformation(
        Array.from(ids)
      );
      console.log("Infomation without status: ", information_without_status);
      var information_with_status = new Array();
      for (let i = 0; i < information_without_status.length; i++) {
        information_with_status.push({
          user_id: information_without_status[i].user_id,
          email: information_without_status[i].email,
          name: information_without_status[i].name,
          status: relationships[information_without_status[i].user_id],
        });
      }
      console.log(`Guardian list of ${user_id}: `, information_with_status);
      res.json(util.Succ(information_with_status));
      return;
    case "strangers":
      if (user_id === undefined) {
        res.json(util.Err(util.ErrCode.Unknown, "invalid argument"));
        return;
      }
      if (!(await db_user.findByID(user_id))) {
        console.log("The user does not exist ", user_id);
        res.json(util.Err(util.ErrCode.Unknown, "user does not exist"));
        return;
      }
      var ids = await db_user.findAllUserIDs();
      var known = await friend_list.getKnownByUserId(user_id);
      var strangers = new Set([...ids].filter((x) => !known.has(x)));
      strangers.delete(Number(user_id));
      var result = Array.from(strangers);
      var information = await db_user.findUsersInformation(result);

      console.log(`Stranger list of ${user_id}: `, information);
      res.json(util.Succ(information));
      return;
    default:
      res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
      return;
  }
});

// TODO: Just for test
app.post("/user", async function (req, res) {
  console.log("Update or Add: ", req.body.user_id, req.body);
  var result: any = await db_user.updateOrAdd(req.body.user_id, req.body);
  console.log("Create a new user, id = ", result.user_id, result);
  const user_info = {
    unique_id: result.unique_id,
    email: result.email,
    name: result.name,
    given_name: result.given_name,
    family_name: result.family_name,
    picture: result.picture,
    locale: result.locale,
    verified_email: result.verified_email,
  };

  const token = jsonwebtoken.sign(user_info, process.env.JWT_SECRET);
  console.log("user cookie", token);
  return res.json(
    util.Succ({
      result: result,
      token: token,
    })
  );
});

// Guardian add
app.post("/user/:user_id/guardian", async function (req, res) {
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
  var guardian_id = req.body.guardian_id;
  console.log(`User ${user_id} wants add guardian`);
  const guardian_email = req.body.guardian_email;

  if (guardian_id !== undefined && guardian_email) {
    res.json(
      util.Err(
        util.ErrCode.Unknown,
        "guardian_id and guardian_email can not exist at the same time"
      )
    );
    return;
  }

  if (util.has_value(guardian_email)) {
    var guardian = await db_user.findByEmail(guardian_email);
    if (guardian) {
      guardian_id = guardian.user_id;
    } else {
      res.json(
        util.Err(
          util.ErrCode.Unknown,
          "guardian_email do not exist in the database"
        )
      );
      return;
    }
  }

  if (!util.has_value(guardian_id)) {
    res.json(
      util.Err(
        util.ErrCode.Unknown,
        "miss guardian_id or guardian_email is not found"
      )
    );
    return;
  }

  if (
    !(await db_user.findByID(user_id)) ||
    !(await db_user.findByID(guardian_id))
  ) {
    console.log("One of the users does not exist", user_id, guardian_id);
    res.json(util.Err(util.ErrCode.Unknown, "one of the users does not exist"));
    return;
  }

  // NOTE: When send a friend requet, self is requester, guardian is responder
  const result = await friend_list.request(user_id, guardian_id);
  if (result) {
    console.log("Send guardian request success!");
    return res.json(util.Succ(result));
  } else {
    console.log("Send a guardian request fail!");
    return res.json(
      util.Err(util.ErrCode.Unknown, "fail to send a guardian request")
    );
  }
});

// Guardian confirm or reject
app.put("/user/:user_id/guardian", async function (req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  const action = req.body.action;
  var guardian_id = req.body.guardian_id;
  if (!util.has_value(user_id) || !util.has_value(action)) {
    res.json(util.Err(util.ErrCode.Unknown, "missing user_id or action"));
    return;
  }

  console.log(`User ${user_id} wants do ${action}`);
  const guardian_email = req.body.guardian_email;

  console.log(
    `${action} is going to do: ${user_id}, ${guardian_id} or ${guardian_email}`
  );

  if (guardian_id !== undefined && guardian_email) {
    res.json(
      util.Err(
        util.ErrCode.Unknown,
        "guardian_id and guardian_email can not exist at the same time"
      )
    );
    return;
  }

  if (util.has_value(guardian_email)) {
    var guardian = await db_user.findByEmail(guardian_email);
    if (guardian) {
      guardian_id = guardian.user_id;
    } else {
      res.json(
        util.Err(
          util.ErrCode.Unknown,
          "guardian_email do not exist in the database"
        )
      );
      return;
    }
  }

  if (!util.has_value(guardian_id)) {
    res.json(
      util.Err(
        util.ErrCode.Unknown,
        "miss guardian_id or guardian_email is not found"
      )
    );
    return;
  }

  if (
    !(await db_user.findByID(user_id)) ||
    !(await db_user.findByID(guardian_id))
  ) {
    console.log("One of the users does not exist", user_id, guardian_id);
    res.json(util.Err(util.ErrCode.Unknown, "one of the users does not exist"));
    return;
  }

  var result;
  switch (action) {
    case "confirm":
      // NOTE: When send a guardian confirm, self is responder, guardian is requester
      result = await friend_list.confirm(guardian_id, user_id);
      if (result) {
        console.log("Confirm a guardian request success!");
        return res.json(util.Succ(result));
      } else {
        console.log("Confirm a guardian request fail!");
        return res.json(
          util.Err(util.ErrCode.Unknown, "fail to confirm a guardian request")
        );
      }
    case "reject":
      // NOTE: When send a guardian reject, self is responder, guardian is requester
      result = await friend_list.reject(guardian_id, user_id);
      if (result) {
        console.log("Reject a guardian request success!");
        return res.json(util.Succ(result));
      } else {
        console.log("Reject a guardian fail!");
        return res.json(
          util.Err(util.ErrCode.Unknown, "fail to reject a guardian request")
        );
      }
    default:
      res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
      return;
  }
});

// Guardian add
app.delete("/user/:user_id/guardian", async function (req, res) {
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
  var guardian_id = req.body.guardian_id;
  if (!util.has_value(user_id)) {
    res.json(util.Err(util.ErrCode.Unknown, "missing user_id"));
    return;
  }

  console.log(`User ${user_id} wants delete guardian`);
  const guardian_email = req.body.guardian_email;

  if (guardian_id !== undefined && guardian_email) {
    res.json(
      util.Err(
        util.ErrCode.Unknown,
        "guardian_id and guardian_email can not exist at the same time"
      )
    );
    return;
  }

  if (util.has_value(guardian_email)) {
    var guardian = await db_user.findByEmail(guardian_email);
    if (guardian) {
      guardian_id = guardian.user_id;
    } else {
      res.json(
        util.Err(
          util.ErrCode.Unknown,
          "guardian_email do not exist in the database"
        )
      );
      return;
    }
  }

  if (!util.has_value(guardian_id)) {
    res.json(
      util.Err(
        util.ErrCode.Unknown,
        "miss guardian_id or guardian_email is not found"
      )
    );
    return;
  }

  if (
    !(await db_user.findByID(user_id)) ||
    !(await db_user.findByID(guardian_id))
  ) {
    console.log("One of the users does not exist", user_id, guardian_id);
    res.json(util.Err(util.ErrCode.Unknown, "one of the users does not exist"));
    return;
  }

  const result = await friend_list.remove(user_id, guardian_id);
  if (result) {
    console.log("Remove a guardian request success!");
    return res.json(util.Succ(result));
  } else {
    console.log("Remove a guardian fail!");
    return res.json(
      util.Err(util.ErrCode.Unknown, "fail to remove a guardian")
    );
  }
});

app.put("/user/:user_id/otpauth", async function (req, res) {
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
  const secret = req.body.secret;
  if (!util.has_value(user_id) || !util.has_value(secret)) {
    res.json(util.Err(util.ErrCode.Unknown, "missing user_id or secret"));
    return;
  }

  const result = await db_user.updateSecret(user_id, secret);

  if (result) {
    console.log("Save a otpauth secret success!");
    res.json(util.Succ(result));
    return;
  } else {
    console.log("Save a otpauth secret fail!");
    res.json(util.Err(util.ErrCode.Unknown, "fail to save a otpauth secret"));
    return;
  }
});

// verify code
app.post("/user/:user_id/otpauth", async function (req, res) {
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
  const code = req.body.code;
  if (!util.has_value(user_id) || !util.has_value(code)) {
    return res.json(util.Err(1, "missing fields"));
  }
  console.log(req.body);
  const user = await db_user.findByID(user_id);
  if (user) {
    if (user.secret) {
      const totp = new TOTP(user.secret);
      var result = totp.verify(code);
      res.json(util.Succ(result));
      return;
    } else {
      console.log("The secret does not exist ", user_id);
      res.json(util.Err(util.ErrCode.Unknown, "secret does not exist"));
      return;
    }
  } else {
    console.log("The user does not exist ", user_id);
    res.json(util.Err(util.ErrCode.Unknown, "user does not exist"));
    return;
  }
});

// Statistics
app.get("/user/:user_id/statistics", async function (req, res) {
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

  var kind = req.query.kind;

  if (kind === undefined) {
    console.log("Satistics kind is not given ", user_id);
    res.json(util.Err(util.ErrCode.Unknown, "satistics kind is not given"));
    return;
  } else {
    console.log(`[Statistics: ${kind}] (${user_id})`);
    return res.json(util.Succ(""));
  }
});

app.post("/user/:user_id/allowance", async function (req, res) {
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

  const user_address = req.body.user_address;
  const token_address = req.body.token_address;
  const swap_address = req.body.swap_address;
  const allowance = req.body.allowance;
  const network_id = req.body.network_id;
  if (
    !util.has_value(user_address) ||
    !util.has_value(swap_address) ||
    !util.has_value(allowance) ||
    !util.has_value(token_address) ||
    !util.has_value(network_id)
  ) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }
  console.log(req.body);

  const result = db_allowance.updateOrAdd(
    network_id,
    token_address,
    user_address,
    swap_address,
    allowance
  );
  res.json(util.Succ(result));
});

app.get("/user/:user_id/allowance", async function (req, res) {
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

  const user_address = req.query.user_address;
  const token_address = req.query.token_address;
  const swap_address = req.query.swap_address;
  const network_id = req.query.network_id;
  if (
    !util.has_value(user_address) ||
    !util.has_value(swap_address) ||
    !util.has_value(network_id) ||
    !util.has_value(token_address)
  ) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }

  let allowance = await db_allowance.get(
    network_id,
    token_address,
    user_address,
    swap_address
  );

  if (allowance === undefined) {
    console.log("The allowance record does not exist: ", user_id);
    res.json(
      util.Err(util.ErrCode.Unknown, "the allowance record does not exist")
    );
    return;
  }

  res.json(util.Succ(allowance));
  return;
});

app.get("/user/:user_id/allowances", async function (req, res) {
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

  const user_address = req.query.user_address;
  const network_id = req.query.network_id;
  if (!util.has_value(user_address) || !util.has_value(network_id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }

  let allowances: any = await db_allowance.findAllAllowancesGreaterThanZero(
    network_id,
    user_address
  );

  console.log(allowances);

  let allowance_list = [];

  if (network_id !== "1") {
    // We only support more information display on mainnet
    for (var i = 0; i < allowances.length; i++) {
      var allowance = allowances[i];

      allowance_list.push({
        approved_time: allowance.updatedAt,
        token_name: "(UNKNOWN TOKEN)",
        token_icon: "",
        token_address: allowance.token_address,
        swap_address: allowance.swap_address,
        allowance: allowance.allowance,
      });
    }
    res.json(util.Succ(allowance_list));
    return;
  }

  for (var i = 0; i < allowances.length; i++) {
    var allowance = allowances[i];
    var token_info =
      TOKEN_CONSTANS.MAINNET_TOKEN_ADDRESS_TO_TOKEN_MAP[
        allowance.token_address
      ];
    if (token_info === undefined) {
      allowance_list.push({
        approved_time: allowance.updatedAt,
        token_name: "(UNKNOWN TOKEN)",
        token_icon: "",
        token_address: allowance.token_address,
        swap_address: allowance.swap_address,
        allowance: allowance.allowance,
      });
    } else {
      allowance_list.push({
        approved_time: allowance.updatedAt,
        token_name:
          TOKEN_CONSTANS.MAINNET_TOKEN_ADDRESS_TO_TOKEN_MAP[
            allowance.token_address
          ].symbol,
        token_icon:
          TOKEN_CONSTANS.MAINNET_TOKEN_ADDRESS_TO_TOKEN_MAP[
            allowance.token_address
          ].logoUrl,
        token_address: allowance.token_address,
        swap_address: allowance.swap_address,
        allowance: allowance.allowance,
      });
    }
  }

  res.json(util.Succ(allowance_list));
  return;
});

app.post("/user/:user_id/address", async function (req, res) {
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

  const user_address = req.body.user_address;
  const network_id = req.body.network_id;
  const cipher_key = req.body.cipher_key;
  if (!util.has_value(user_address) || !util.has_value(network_id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }
  console.log("Add address information: ", req.body);

  const result = db_address.updateOrAdd(
    user_id,
    network_id,
    user_address,
    cipher_key
  );
  res.json(util.Succ(result));
});

app.get("/user/:user_id/addresses", async function (req, res) {
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
  let filter;

  if (util.has_value(req.query.address) && util.has_value(req.query.email)) {
    console.log("address and emial can not both exist");
    res.json(
      util.Err(util.ErrCode.InvalidAuth, "address and emial can not both exist")
    );
    return;
  } else if (util.has_value(req.query.address)) {
    filter = {
      user_address: req.query.address,
    };
  } else if (util.has_value(req.query.email)) {
    let user = await db_user.findByEmail(req.query.email);
    if (user === null) {
      res.json(util.Succ([]));
      return;
    }
    console.log(user);
    let found_user_id = user["user_id"];
    filter = { user_id: found_user_id };
  } else {
    // Nothing given, then return all the addresses the user has
    filter = {
      user_id: user_id,
    };
  }
  let addresses_array: any = await db_address.findAll(filter);
  res.json(util.Succ(addresses_array));

  return;
});

app.get("/user/:user_id/friends_addresses", async function (req, res) {
  // TODO: search friends and then return addresses
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
  let filter;

  if (util.has_value(req.query.address) && util.has_value(req.query.email)) {
    console.log("address and emial can not both exist");
    res.json(
      util.Err(util.ErrCode.InvalidAuth, "address and emial can not both exist")
    );
    return;
  } else if (util.has_value(req.query.address)) {
    filter = {
      user_address: req.query.address,
    };
  } else if (util.has_value(req.query.email)) {
    let user = await db_user.findByEmail(req.query.email);
    if (user === null) {
      res.json(util.Succ([]));
      return;
    }
    console.log(user);
    let found_user_id = user["user_id"];
    filter = { user_id: found_user_id };
  } else {
    // Nothing given, then return all the addresses the user has
    filter = {
      user_id: user_id,
    };
  }

  let addresses_array: any = await db_address.findAll(filter);
  let addresses = addresses_array.map((a) => a.user_address);

  // should remove duplicate addresses
  let unique_addresses = [...new Set(addresses)];

  console.log("Return all addresses:", unique_addresses);

  res.json(util.Succ(unique_addresses));
  return;
});

require("./login/google")(app);
require("./relay/relay")(app);
require("./wallet/wallet")(app);
require("./message")(app);

app.listen(3000, function () {
  console.log("Eigen Service listening on port 3000!");
});
