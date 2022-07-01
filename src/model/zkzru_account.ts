// database.ts
/**
 * tx and account definition
 *
 * @module database
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, DataTypes } from "sequelize";
import consola from "consola";
import * as util from "../util";
import { ethers } from "ethers";

util.require_env_variables(["COORDINATOR_PRIVATE_KEY", "NETWORK_ID"])
const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY
const network_id = process.env.NETWORK_ID

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/zkzruaccount_db.sqlite",
});

const accountdb = sequelize.define("account_st", {
  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },

  index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  pubkey: {
    type: DataTypes.CITEXT,
    allowNull: false,
  },

  address: {
    type: DataTypes.CITEXT,
    allowNull: false,
  },

  tokenType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  balance: {
    allowNull: false,
    type: DataTypes.STRING,
  },

  nonce: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

sequelize
  .sync()
  .then(function () {
    // create zeroAccount, set index=0 to make autoIncrement start from 0
    let res1 = accountdb.create({
      network_id: network_id,
      index: 0,
      pubkey: "0",
      address: "0",
      tokenType: 0,
      balance: "0",
      nonce: 0
    });
    // create coordinator account
    let res2 = accountdb.create({
      network_id: network_id,
      pubkey: ethers.utils.computePublicKey(coordinatorPrivateKey),
      address: ethers.utils.computeAddress(coordinatorPrivateKey),
      tokenType: 0,
      balance: "0",
      nonce: 1
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (network_id, pubkey, address, tokenType, balance, nonce) {
  return accountdb.create({
    network_id,
    pubkey,
    address,
    tokenType,
    balance,
    nonce
  });
};

const findOne = function (filter_dict) {
  return accountdb.findOne({ where: filter_dict });
};
const findAll = function (dict) {
  return accountdb.findAll({ where: dict });
};

export { add, findOne, findAll };
