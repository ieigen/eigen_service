// tx.ts
/**
 * tx definition
 *
 * @module database
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, DataTypes } from "sequelize";
import consola from "consola";
import { parse } from "dotenv";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/zkzrutx_db.sqlite",
});

const l2txdb = sequelize.define("tx_st", {
  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },

  txid: {
    type: DataTypes.CITEXT,
    allowNull: false,
    primaryKey: true,
  },

  senderPubkey: {
      type: DataTypes.CITEXT,
      allowNull: false,
  },

  r8x: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  r8y: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  s: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  receiverPubkey: {
      type: DataTypes.CITEXT,
      allowNull: false
  },

  tokenTypeFrom: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },

  amount: {
    allowNull: false,
    type: DataTypes.STRING,
  },

  nonce: {
      allowNull: false,
      type: DataTypes.BIGINT,
  },

  index: {
      allowNull: false,
      type: DataTypes.BIGINT,
  },

  // 0: new, 1, confirming, 2, confirmed
  status: {
    allowNull: false,
    type: DataTypes.INTEGER,
  }
});

sequelize
  .sync()
  .then(function () {
    return l2txdb.create({
      network_id: "id",
      senderPubkey: "0xUSER", //public key
      receiverPubkey: "0xUSER", //public key
      tokenType: 1,
      balance: "100",
      nonce: 1,
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        address: "0xUSER",
        tokenType: 1,
        nonce: 1,
      })
    );
    l2txdb.destroy({
      where: {
        address: "0xUSER",
        tokenType: 1,
        nonce: 1,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = async function (network_id, senderPubkey, receiverPubkey, index, amount, nonce, tokenTypeFrom) {
  let res = await l2txdb.create({
    network_id,
    senderPubkey,
    receiverPubkey,
    index,
    amount,
    nonce,
    tokenTypeFrom
  });
  return res;
};

const findOne = async function (filter_dict) {
  let res = await l2txdb.findOne({ where: filter_dict });
  return res;
};

const findAll = async function (dict) {
  let res =  l2txdb.findAll({ where: dict });
  return res;
};

const emptyTX = () => {
    return {
        "network_id": 0,
        "senderPubkey": "",
        "receiverPubkey": "",
        "index": 0,
        "amount": 0,
        "nonce": 0,
        "tokenTypeFrom": 0
    }
}

const update = (filter_dict, value_dict) => {
    return l2txdb
    .update(
        { value_dict },
        {
            where: filter_dict,
        }
    )
    .then(function (result: any) {
        consola.log("Update all tx status result: ", result);
        return true;
    })
}

export { add, findOne, findAll, emptyTX, update};
