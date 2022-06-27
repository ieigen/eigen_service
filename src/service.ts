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

// service.ts
/**
 * The service implementation for eigen_service
 *
 * @module service
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import jsonwebtoken from "jsonwebtoken";

import consola from "consola";
import TOTP from "totp.js";
import "dotenv/config";

import * as log4js from "./log";
import * as db_pk from "./model/database_pk";
import * as db_txh from "./model/database_transaction_history";
import * as db_recovery from "./model/database_recovery";
import * as friend_list from "./model/database_friend_relationship";
import * as db_address from "./model/database_address";
import * as util from "./util";
import * as db_user from "./model/database_id";

import * as TOKEN_CONSTANS from "./token/constants";
import * as db_allowance from "./token/allowance";
import * as db_multisig from "./model/database_multisig";
import * as db_wallet from "./model/database_wallet";

const logger = log4js.logger("Eigen");

/**
 * Stores public key
 *
 * @param req
 * @param res
 * @returns {string}
 */
export async function getStores(req, res) {
  return res.json(util.Succ(await db_pk.findAll()));
}

export async function getStore(req, res) {
  const digest = req.query.digest;
  if (!util.has_value(digest)) {
    logger.error("digest is empty");
    consola.error("digest is empty");
    return res.json(util.Err(1, "digest missing"));
  }
  const result = await db_pk.findByDigest(digest);
  if (!result) {
    return res.json(util.Succ({}));
  }
  res.json(util.Succ(result));
}

// add new key
export async function postStore(req, res) {
  const digest = req.body.digest;
  const pk = req.body.public_key;
  if (!util.has_value(digest) || !util.has_value(pk)) {
    consola.error("missing dig or pk");
    return res.json(util.Err(1, "missing dig or pk"));
  }

  const result = db_pk.updateOrAdd(digest, digest, pk);
  res.json(util.Succ(result));
}

// update
export async function putStore(req, res) {
  const old_digest = req.body.old_digest;
  const digest = req.body.digest;
  const pk = req.body.public_key;
  if (
    !util.has_value(digest) ||
    !util.has_value(pk) ||
    !util.has_value(old_digest)
  ) {
    consola.error("missing dig or pk");
    return res.json(util.Err(1, "missing dig or pk"));
  }
  const result = db_pk.updateOrAdd(old_digest, digest, pk);
  res.json(util.Succ(result));
}

// get recovery data
export async function getRecovery(req, res) {
  consola.info(JSON.stringify(req.query));
  const user_id = req.query.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }

  const result = await db_recovery.findByUserID(user_id);
  consola.log(result);
  res.json(util.Succ(result));
}

// get recovery data
export async function deleteRecovery(req, res) {
  consola.log(JSON.stringify(req.query));
  const id = req.body.id;

  if (!util.check_user_id(req, id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  const result = await db_recovery.remove(id);
  consola.log(result);
  res.json(util.Succ(result));
}

export async function postRecovery(req, res) {
  consola.log(JSON.stringify(req.body));
  const user_id = req.body.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
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
  consola.log(result);
  res.json(util.Succ(result));
}

export async function getTxhs(req, res) {
  const action = req.query.action;
  consola.log(req.query);

  const page = req.query.page;
  const page_size = req.query.page_size;
  const order = req.query.order;

  const allow_fileds = {
    from: req.query.from,
    to: req.query.to,
    txid: req.query.txid,
    network_id: req.query.network_id,
    from_type: req.query.from_type,
    to_network_id: req.query.to_network_id,
    block_num: req.query.block_num,
    operation: req.query.operation,
  };

  const filter = Object.keys(allow_fileds)
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
    case "search_both_sides": // Search both sides now is a legacy name, it means search multi sig transcations
      const from = req.query.from;
      const to = req.query.to;
      const address = req.query.address;
      if (
        !util.has_value(address) ||
        util.has_value(from) ||
        util.has_value(to)
      ) {
        consola.error(
          "wrong search pattern for both sized, address should be given, neither from or to should not be given"
        );
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            "wrong search pattern for both sized, address should be given, neither from or to should not be given"
          )
        );
        return;
      }

      // Firstly, the address as an owner,
      const wallets = await db_wallet.findAll({
        address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });

      // select * from thx where from == xxx;
      const as_owners = [address];
      if (wallets !== null) {
        for (const wallet of wallets) {
          as_owners.push(wallet["wallet_address"]);
        }
      }

      // Secondly, the address as a signer, and the status is "Creating"
      const signers = await db_wallet.search({
        where: {
          address: address,
          role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        },
        raw: true,
      });

      const as_signers = [];
      for (const signer of signers) {
        // select * from thx where from in (y, y, y) and status = zzz
        as_signers.push(signer["wallet_address"]);
      }

      result = await db_txh.search_with_multisig(
        as_owners,
        as_signers,
        filter,
        page,
        page_size,
        order
      );
      break;
    default:
      return res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
  }

  consola.log("result", result);
  //OPT: use batch
  if (result != null) {
    const transactions = result["transactions"];
    for (let i = 0; i < transactions.length; i++) {
      const txid = transactions[i]["txid"];
      if (!util.has_value(txid)) continue;
      const res = await db_multisig.findMultisigMetaByConds({ txid: txid });
      if (res == null) continue;
      if (!util.has_value(res["id"])) continue;
      transactions[i]["mtxid"] = res["id"];
    }
    consola.log(transactions);
    result["transactions"] = transactions;
  }
  return res.json(util.Succ(result));
}

export async function getTxh(req, res) {
  const action = req.query.action;
  consola.log("action = ", action);
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
}

// add transaction
export async function postTxh(req, res) {
  const txid = req.body.txid;
  const from = req.body.from;
  const to = req.body.to;
  const value = req.body.value;
  const type = req.body.type;
  const name = req.body.name;
  const network_id = req.body.network_id;
  const to_network_id = req.body.to_network_id;
  const operation = req.body.operation;
  const old_txid = req.body.old_txid;
  if (
    !util.has_value(txid) ||
    !util.has_value(network_id) ||
    !util.has_value(from) ||
    !util.has_value(value) ||
    !util.has_value(to) ||
    !util.has_value(operation) ||
    !util.has_value(type)
  ) {
    consola.error("missing fields");
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }

  if (util.has_value(old_txid)) {
    const res = db_txh.delByTxid(old_txid);
    consola.info("speed up tx, delete old tx res:", res);
  }

  if (type == db_txh.TX_TYPE_L1ToL2 || type == db_txh.TX_TYPE_L2ToL1) {
    if (!util.has_value(to_network_id)) {
      consola.error(
        "missing fields, cross chain transaction should set 'to_network_id'"
      );
      return res.json(
        util.Err(
          util.ErrCode.Unknown,
          "missing fields, cross chain transaction should set 'to_network_id'"
        )
      );
    }
  }
  consola.log(req.body);

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
}

// update transaction status
export async function putTxh(req, res) {
  const txid = req.params.txid;
  if (!util.has_value(txid)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }
  const result = db_txh.updateOrAdd(txid, {
    status: req.body.status || 0,
    sub_txid: req.body.sub_txid || "",
  });
  res.json(util.Succ(result));
}

// add meta
export async function postMeta(req, res) {
  const ret = await db_multisig.addMultisigMeta(
    req.body.network_id,
    req.body.user_id,
    req.body.wallet_address,
    req.body.to,
    req.body.value,
    req.body.data,
    req.body.operation
  );
  res.json(util.Succ(ret));
}

// update txid
export async function putMeta(req, res) {
  if (!util.has_value(req.body.id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'id'"));
  }
  const ret = await db_multisig.updateMultisigMeta(req.body.id, req.body.txid);
  res.json(util.Succ(ret));
}

export async function getMeta(req, res) {
  if (!util.has_value(req.params.id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'id'"));
  }
  const ret = await db_multisig.findMultisigMetaByConds({ id: req.params.id });
  // return owner_address and mtx status
  const mtx = await db_txh.getByTxid(ret["txid"]);
  if (mtx != null) {
    ret["status"] = mtx["status"];
  }

  const walletInfo = await db_wallet.findOne({
    wallet_address: ret["wallet_address"],
  });
  if (walletInfo != null) {
    ret["owner_address"] = walletInfo["address"];
  }
  res.json(util.Succ(ret));
}

// add sign message
export async function postSign(req, res) {
  if (!util.has_value(req.body.mtxid)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'mtxid'"));
  }
  const ret = await db_multisig.addSignMessage(
    req.body.mtxid,
    req.body.signer_address,
    req.body.signer_message,
    req.body.status,
    req.body.operation
  );
  res.json(util.Succ(ret));
}

// query sign message
export async function getSign(req, res) {
  if (!util.has_value(req.params.mtxid)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields 'mtxid'"));
  }
  const sm = await db_multisig.findSignHistoryByMtxid(req.params.mtxid);
  consola.log("signed message", sm);
  const resultsm = [];
  // get all sigers
  const meta = await db_multisig.findMultisigMetaByConds({
    id: req.params.mtxid,
  });
  consola.log("meta", meta);
  if (meta == null) {
    return res.json(util.Succ(sm));
  }
  const allSigners = await db_wallet.findAll({
    wallet_address: meta["wallet_address"],
  });
  consola.log(allSigners);
  const signedSigners = new Map<string, boolean>();

  if (sm !== null) {
    for (let i = 0; i < sm.length; i++) {
      // get user_id
      const addrInfo = await db_address.findOne({
        user_address: sm[i]["signer_address"],
      });
      signedSigners.set(sm[i]["signer_address"], true);
      if (addrInfo == null) continue;
      const userInfo = await db_user.findByID(addrInfo["user_id"]);
      if (userInfo == null) continue;

      const signInfo = {
        name: userInfo["name"],
        picture: userInfo["picture"],
        id: i,
        mtxid: req.params.mtxid,
        signer_address: sm[i]["signer_address"],
        sign_message: sm[i]["sign_message"],
        status: sm[i]["status"],
      };
      resultsm.push(signInfo);
    }

    const signedSize = resultsm.length;
    for (let i = 0; i < allSigners.length; i++) {
      const signer = allSigners[i];
      if (signedSigners.has(signer["address"])) {
        continue;
      }

      const addrInfo = await db_address.findOne({
        user_address: signer["address"],
      });
      signedSigners.set(signer["address"], true);
      if (addrInfo == null) continue;
      const userInfo = await db_user.findByID(addrInfo["user_id"]);
      if (userInfo == null) continue;

      const signInfo = {
        id: i + signedSize,
        mtxid: req.params.mtxid,
        signer_address: signer["address"],
        sign_message: null,
        name: userInfo["name"],
        picture: userInfo["picture"],
        status: db_txh.TransactionStatus.Creating,
      };
      resultsm.push(signInfo);
    }
  }

  // get the unsigned signer info
  return res.json(util.Succ(resultsm));
}

// get user, his/her friends, his/her strangers by id
export async function getUser(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
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
    consola.log(result);
    res.json(util.Succ(result));
    return;
  }

  switch (action) {
    case "guardians": {
      const filter_status = req.query.status;
      if (filter_status !== undefined) {
        consola.info("Filter the status of guardians: ", filter_status);
      }
      if (user_id === undefined) {
        const all_relationships = await friend_list.findAll();
        res.json(util.Succ(all_relationships));
        return;
      }
      if (!(await db_user.findByID(user_id))) {
        consola.error("The user does not exist ", user_id);
        res.json(util.Err(util.ErrCode.Unknown, "user does not exist"));
        return;
      }
      const status = await friend_list.getStatusByUserId(user_id);
      const ids = new Set();
      const relationships = new Map();
      for (let i = 0; i < status.length; i++) {
        // There isn't status filter or filter the status
        if (filter_status === undefined || filter_status == status[i].status) {
          ids.add(status[i].user_id);
          relationships[status[i].user_id] = status[i].status;
        }
      }
      consola.log(status, ids);
      const information_without_status: any =
        await db_user.findUsersInformation(Array.from(ids));
      consola.log("Infomation without status: ", information_without_status);
      const information_with_status = new Array<any>();
      for (let i = 0; i < information_without_status.length; i++) {
        information_with_status.push({
          user_id: information_without_status[i].user_id,
          email: information_without_status[i].email,
          name: information_without_status[i].name,
          status: relationships[information_without_status[i].user_id],
        });
      }
      consola.log(`Guardian list of ${user_id}: `, information_with_status);
      res.json(util.Succ(information_with_status));
      return;
    }
    case "strangers": {
      if (user_id === undefined) {
        res.json(util.Err(util.ErrCode.Unknown, "invalid argument"));
        return;
      }
      if (!(await db_user.findByID(user_id))) {
        consola.error("The user does not exist ", user_id);
        res.json(util.Err(util.ErrCode.Unknown, "user does not exist"));
        return;
      }
      const ids = await db_user.findAllUserIDs();
      const known = await friend_list.getKnownByUserId(user_id);
      const strangers = new Set([...ids].filter((x) => !known.has(x)));
      strangers.delete(Number(user_id));
      const result = Array.from(strangers);
      const information = await db_user.findUsersInformation(result);

      consola.log(`Stranger list of ${user_id}: `, information);
      res.json(util.Succ(information));
      return;
    }
    default: {
      res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
      return;
    }
  }
}

// TODO: Just for test
export async function postUser(req, res) {
  consola.log("Update or Add: ", req.body.user_id, req.body);
  const result: any = await db_user.updateOrAdd(req.body.user_id, req.body);
  consola.log("Create a new user, id = ", result.user_id, result);
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
  consola.log("user cookie", token);
  return res.json(
    util.Succ({
      result: result,
      token: token,
    })
  );
}

// Guardian add
export async function postGuardian(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  let guardian_id = req.body.guardian_id;
  consola.log(`User ${user_id} wants add guardian`);
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
    const guardian = await db_user.findByEmail(guardian_email);
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
    consola.error("One of the users does not exist", user_id, guardian_id);
    res.json(util.Err(util.ErrCode.Unknown, "one of the users does not exist"));
    return;
  }

  // NOTE: When send a friend requet, self is requester, guardian is responder
  const result = await friend_list.request(user_id, guardian_id);
  if (result) {
    consola.log("Send guardian request success!");
    return res.json(util.Succ(result));
  } else {
    consola.log("Send a guardian request fail!");
    return res.json(
      util.Err(util.ErrCode.Unknown, "fail to send a guardian request")
    );
  }
}

// Guardian confirm or reject
export async function putGuardian(req, res) {
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
  let guardian_id = req.body.guardian_id;
  if (!util.has_value(user_id) || !util.has_value(action)) {
    res.json(util.Err(util.ErrCode.Unknown, "missing user_id or action"));
    return;
  }

  consola.log(`User ${user_id} wants do ${action}`);
  const guardian_email = req.body.guardian_email;

  consola.log(
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
    const guardian = await db_user.findByEmail(guardian_email);
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
    consola.log("One of the users does not exist", user_id, guardian_id);
    res.json(util.Err(util.ErrCode.Unknown, "one of the users does not exist"));
    return;
  }

  let result;
  switch (action) {
    case "confirm": {
      // NOTE: When send a guardian confirm, self is responder, guardian is requester
      result = await friend_list.confirm(guardian_id, user_id);
      if (result) {
        consola.log("Confirm a guardian request success!");
        return res.json(util.Succ(result));
      } else {
        consola.log("Confirm a guardian request fail!");
        return res.json(
          util.Err(util.ErrCode.Unknown, "fail to confirm a guardian request")
        );
      }
      break;
    }
    case "reject": {
      // NOTE: When send a guardian reject, self is responder, guardian is requester
      result = await friend_list.reject(guardian_id, user_id);
      if (result) {
        consola.log("Reject a guardian request success!");
        return res.json(util.Succ(result));
      } else {
        consola.log("Reject a guardian fail!");
        return res.json(
          util.Err(util.ErrCode.Unknown, "fail to reject a guardian request")
        );
      }
      break;
    }
    default: {
      res.json(util.Err(util.ErrCode.Unknown, "invalid action"));
      return;
    }
  }
}

// Guardian add
export async function deleteGuardian(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  let guardian_id = req.body.guardian_id;
  if (!util.has_value(user_id)) {
    res.json(util.Err(util.ErrCode.Unknown, "missing user_id"));
    return;
  }

  consola.log(`User ${user_id} wants delete guardian`);
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
    const guardian = await db_user.findByEmail(guardian_email);
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
    consola.error("One of the users does not exist", user_id, guardian_id);
    res.json(util.Err(util.ErrCode.Unknown, "one of the users does not exist"));
    return;
  }

  const result = await friend_list.remove(user_id, guardian_id);
  if (result) {
    consola.log("Remove a guardian request success!");
    return res.json(util.Succ(result));
  } else {
    consola.log("Remove a guardian fail!");
    return res.json(
      util.Err(util.ErrCode.Unknown, "fail to remove a guardian")
    );
  }
}

export async function putOtpauth(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
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
    consola.log("Save a otpauth secret success!");
    res.json(util.Succ(result));
    return;
  } else {
    consola.log("Save a otpauth secret fail!");
    res.json(util.Err(util.ErrCode.Unknown, "fail to save a otpauth secret"));
    return;
  }
}

// verify code
export async function postOtpauth(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
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
  consola.log(req.body);
  const user = await db_user.findByID(user_id);
  if (user) {
    if (user.secret) {
      const totp = new TOTP(user.secret);
      const result = totp.verify(code);
      res.json(util.Succ(result));
      return;
    } else {
      consola.error("The secret does not exist ", user_id);
      res.json(util.Err(util.ErrCode.Unknown, "secret does not exist"));
      return;
    }
  } else {
    consola.error("The user does not exist ", user_id);
    res.json(util.Err(util.ErrCode.Unknown, "user does not exist"));
    return;
  }
}

// Statistics
export async function getStatistics(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }

  const kind = req.query.kind;

  if (kind === undefined) {
    consola.info("Satistics kind is not given ", user_id);
    res.json(util.Err(util.ErrCode.Unknown, "satistics kind is not given"));
    return;
  } else {
    consola.info(`[Statistics: ${kind}] (${user_id})`);
    return res.json(util.Succ(""));
  }
}

export async function postAllowance(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
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
  consola.log(req.body);

  const result = db_allowance.updateOrAdd(
    network_id,
    token_address,
    user_address,
    swap_address,
    allowance
  );
  res.json(util.Succ(result));
}

export async function getAllowance(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }

  consola.log(req.query);

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

  const allowance = await db_allowance.get(
    network_id,
    token_address,
    user_address,
    swap_address
  );

  if (allowance === undefined) {
    consola.error("The allowance record does not exist: ", user_id);
    res.json(
      util.Err(util.ErrCode.Unknown, "the allowance record does not exist")
    );
    return;
  }

  res.json(util.Succ(allowance));
  return;
}

export async function getAllowances(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }

  consola.log(req.query);

  const user_address = req.query.user_address;
  const network_id = req.query.network_id;
  if (!util.has_value(user_address) || !util.has_value(network_id)) {
    return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
  }

  const allowances: any = await db_allowance.findAllAllowancesGreaterThanZero(
    network_id,
    user_address
  );

  consola.log(allowances);

  const allowance_list = [];

  if (network_id !== "1") {
    // We only support more information display on mainnet
    for (let i = 0; i < allowances.length; i++) {
      const allowance = allowances[i];

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

  for (let i = 0; i < allowances.length; i++) {
    const allowance = allowances[i];
    const token_info =
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
}

export async function postAddress(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
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
  consola.log("Add address information: ", req.body);

  const result = db_address.updateOrAdd(
    user_id,
    network_id,
    user_address,
    cipher_key
  );
  res.json(util.Succ(result));
}

export async function getAddresses(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }

  consola.log(req.query);
  let filter;

  if (util.has_value(req.query.address) && util.has_value(req.query.email)) {
    consola.error("address and emial can not both exist");
    res.json(
      util.Err(util.ErrCode.InvalidAuth, "address and emial can not both exist")
    );
    return;
  } else if (util.has_value(req.query.address)) {
    filter = {
      user_address: req.query.address,
    };
  } else if (util.has_value(req.query.email)) {
    const user = await db_user.findByEmail(req.query.email);
    if (user === null) {
      res.json(util.Succ([]));
      return;
    }
    consola.log(user);
    const found_user_id = user["user_id"];
    filter = { user_id: found_user_id };
  } else {
    // Nothing given, then return all the addresses the user has
    filter = {
      user_id: user_id,
    };
  }
  const addresses_array: any = await db_address.findAll(filter);
  res.json(util.Succ(addresses_array));

  return;
}

export async function getFriendsAddresses(req, res) {
  // TODO: search friends and then return addresses
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }

  consola.log(req.query);
  let filter;

  if (util.has_value(req.query.address) && util.has_value(req.query.email)) {
    consola.error("address and emial can not both exist");
    res.json(
      util.Err(util.ErrCode.InvalidAuth, "address and emial can not both exist")
    );
    return;
  } else if (util.has_value(req.query.address)) {
    filter = {
      user_address: req.query.address,
    };
  } else if (util.has_value(req.query.email)) {
    const user = await db_user.findByEmail(req.query.email);
    if (user === null) {
      res.json(util.Succ([]));
      return;
    }
    consola.log(user);
    const found_user_id = user["user_id"];
    filter = { user_id: found_user_id };
  } else {
    // Nothing given, then return all the addresses the user has
    filter = {
      user_id: user_id,
    };
  }

  const address_records: any = await db_address.findAll(filter);
  const result = [];
  const address_set = new Set();
  for (const address_record of address_records) {
    if (!address_set.has(address_record.user_address)) {
      address_set.add(address_record.user_address);
      const user_id = address_record.user_id;
      const user = await db_user.findByID(user_id);
      result.push({
        address: address_record.user_address,
        picture: user["picture"],
        name: user["name"],
      });
    }
  }

  consola.info("Return all records:", result);

  res.json(util.Succ(result));
  return;
}

export async function deleteAddress(req, res) {
  const user_id = req.params.user_id;
  if (!util.check_user_id(req, user_id)) {
    consola.error("user_id does not match with decoded JWT");
    res.json(
      util.Err(
        util.ErrCode.InvalidAuth,
        "user_id does not match, you can't see any other people's information"
      )
    );
    return;
  }
  if (!util.has_value(req.body.user_address)) {
    return res.json(
      util.Err(util.ErrCode.Unknown, "missing fields 'user_address'")
    );
  }
  const address = req.body.user_address;
  const result = db_address.deleteAddress(address);
  consola.log("delete address result: ", result);
  res.json(util.Succ(result));
}
