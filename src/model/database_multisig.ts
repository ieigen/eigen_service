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
// database_multisig.ts
/**
 * Multi signature model definition
 *
 * @module database_multisig
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { v4 as uuidv4 } from "uuid";
import { Sequelize, DataTypes } from "sequelize";
import consola from "consola";

// FIXME don't depend another model, move them to controller
import * as walletdb from "./database_wallet";
import * as txhdb from "./database_transaction_history";

const sequelizeMeta = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_multisig_meta.sqlite",
});

const multisigMetaDB = sequelizeMeta.define("multisig_meta_st", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.INTEGER,
  wallet_address: DataTypes.CITEXT,
  to: DataTypes.CITEXT,
  value: DataTypes.STRING,
  data: DataTypes.STRING,
  txid: {
    type: DataTypes.UUIDV4,
    defaultValue: function () {
      return uuidv4();
    },
  },
  operation: DataTypes.INTEGER,
});

const sequelizeSignHistory = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_sign_history.sqlite",
});

/**
 * The kind of signature operation.
 *
 * @enum
 */
export enum SignOperation {
  None = 0,
  Recovery = 1,
  LargeTransaction = 2,
}

export const signHistoryDB = sequelizeSignHistory.define("sign_history", {
  mtxid: DataTypes.INTEGER,
  signer_address: DataTypes.CITEXT,
  sign_message: DataTypes.STRING,
  status: DataTypes.INTEGER,
  operation: DataTypes.INTEGER,
});

sequelizeMeta
  .sync()
  .then(function () {
    return multisigMetaDB.create({
      user_id: 1,
      wallet_address: "0x",
      to: "0x", // Owner or signer's address
      value: "",
      data: "",
      txid: "",
      operation: SignOperation.None,
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        user_id: 1,
        wallet_address: "0x",
      })
    );
    multisigMetaDB.destroy({
      where: {
        user_id: row.user_id,
        wallet_address: row.wallet_address,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

sequelizeSignHistory
  .sync()
  .then(function () {
    return multisigMetaDB.create({
      mtxid: 0,
      signer_address: "0x",
      sign_message: "0x", // Owner or signer's address
      status: walletdb.SignerStatus.None,
      operation: SignOperation.None,
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        id: row.id,
      })
    );
    multisigMetaDB.destroy({
      where: {
        id: row.id,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const addMultisigMeta = function (
  network_id,
  user_id,
  wallet_address,
  to,
  value,
  data,
  operation
) {
  // Here we should get a txid value in order to add it into multisigMetaDB
  const txid = uuidv4();
  // mock a txh
  consola.log("txid", txid);
  txhdb.add({
    txid: txid,
    network_id: network_id,
    from: wallet_address,
    to: to,
    from_type: txhdb.FROM_TYPE_WALLET,
    type: txhdb.TX_TYPE_L1ToL1,
    status: txhdb.TransactionStatus.Creating,
    operation: "Creating",
  });
  return multisigMetaDB.create({
    user_id,
    wallet_address,
    to,
    value,
    data,
    txid,
    operation,
  });
};

const findMultisigMetaByConds = function (conds) {
  return multisigMetaDB.findOne({ where: conds, raw: true });
};

const updateMultisigMeta = function (id, txid) {
  return multisigMetaDB
    .findOne({
      where: {
        id: id,
      },
    })
    .then(function (row: any) {
      if (row === null) {
        return false;
      }
      // delete the fake txh
      txhdb.delByTxid(row["txid"]);

      const actual_update_dict = { txid: txid };

      return row
        .update(actual_update_dict)
        .then(function (result) {
          consola.log("Update success: " + JSON.stringify(result));
          return true;
        })
        .catch(function (err) {
          consola.log("Update error: " + err);
          return false;
        });
    });
};

const addSignMessage = function (
  mtxid,
  signer_address,
  sign_message,
  status,
  operation
) {
  return signHistoryDB.create({
    mtxid,
    signer_address,
    sign_message,
    status,
    operation,
  });
};

const findSignHistoryByMtxid = function (mtxid) {
  return signHistoryDB.findAll({ where: { mtxid }, raw: true });
};

const findLatestRecoveryMtxidByWalletAddress = function (wallet_address) {
  return multisigMetaDB.findOne({
    where: { wallet_address, operation: SignOperation.Recovery },
    order: [["updatedAt", "DESC"]],
    raw: true,
  });
};

const getRecoverySignMessages = function (mtxid) {
  return signHistoryDB.findAll({
    attributes: [["sign_message", "sign_message"]],
    where: { mtxid, operation: SignOperation.Recovery },
    order: [["signer_address", "DESC"]],
    raw: true,
  });
};

function getSignatures(sign_messages, returnBadSignatures = false) {
  // sign_messages is sorted by the signer address when get from database
  let sigs = "0x";
  for (let index = 0; index < sign_messages.length; index += 1) {
    let sig = sign_messages[index];

    consola.log(sig);

    if (returnBadSignatures) {
      sig += "a1";
    }

    sig = sig.slice(2);
    sigs += sig;
  }
  return sigs;
}

export {
  addSignMessage,
  findSignHistoryByMtxid,
  findMultisigMetaByConds,
  addMultisigMeta,
  updateMultisigMeta,
  findLatestRecoveryMtxidByWalletAddress,
  getRecoverySignMessages,
  getSignatures,
};
