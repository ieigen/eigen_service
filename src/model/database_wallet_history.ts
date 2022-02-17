// database_wallet_history.ts
/**
 * Wallet history model definition
 *
 * @module database_wallet_history
 */

import { Sequelize, DataTypes } from "sequelize";

import { WalletStatus } from "./database_wallet";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_wallet_history.sqlite",
});

/**
 * The cause of a status transaction change.
 *
 * @enum
 */
export enum StatusTransitionCause {
  None = 0,
  Create = 1,
  AddSigner = 2,
  Freeze = 3,
  Unlock = 4,
  TransactionSuccess = 11,
  TransactionFail = 12,
}

const whdb = sequelize.define("wallet_history_st", {
  wallet_id: DataTypes.INTEGER,
  from: DataTypes.INTEGER,
  to: DataTypes.INTEGER,
  txid: DataTypes.CITEXT,
  cause: DataTypes.INTEGER,
});

sequelize
  .sync()
  .then(function () {
    return whdb.create({
      wallet_id: 1,
      from: WalletStatus.None,
      to: WalletStatus.None,
      txid: "0x",
      cause: StatusTransitionCause.None,
    });
  })
  .then(function (row: any) {
    console.log(
      row.get({
        wallet_id: 1,
        from: WalletStatus.None,
        to: WalletStatus.None,
        txid: "0x",
        cause: StatusTransitionCause.None,
      })
    );
    whdb.destroy({
      where: {
        wallet_id: row.wallet_id,
        from: row.from,
        to: row.to,
        txid: row.txid,
        cause: row.cause,
      },
    });
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const add = function (wallet_id, from, to, txid, cause) {
  return whdb.create({
    wallet_id,
    from,
    to,
    txid,
    cause,
  });
};

const findOne = function (filter_dict) {
  return whdb.findOne({ where: filter_dict, raw: true });
};

const findAllByWalletId = function (wallet_id) {
  return whdb.findAll({
    where: {
      wallet_id,
    },
  });
};

const findLatestByWalletId = function (wallet_id) {
  return whdb.findAll({
    where: {
      wallet_id,
    },
    order: [["updatedAt", "DESC"]],
  });
};

const findLatestByTxid = function (txid) {
  return whdb.findAll({
    where: {
      txid,
    },
    order: [["updatedAt", "DESC"]],
  });
};

export {
  add,
  findOne,
  findAllByWalletId,
  findLatestByWalletId,
  findLatestByTxid,
};
