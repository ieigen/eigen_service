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

util.require_env_variables(["COORDINATOR_PRIVATE_KEY", "COORDINATOR_PUBLIC_KEY", "COORDINATOR_ADDRESS", "NETWORK_ID"])
const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY
const network_id = process.env.NETWORK_ID
const coordinatorPublicKey = process.env.COORDINATOR_PUBLIC_KEY
const coordinatorAddress = process.env.COORDINATOR_ADDRESS

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

  account_index: {
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

  virtual_nonce: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

sequelize
  .sync()
  .then(function () {
    return accountdb.create({
      network_id: network_id,
      account_index: 0,
      pubkey: "0",
      address: "0",
      tokenType: 0,
      balance: "0",
      nonce: 0, // currently nonce must be 0
      virtual_nonce: 0
    });
  })
  .then(function (row: any) {
    accountdb.destroy({
      where: {
        account_index: 0
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (account_index, network_id, pubkey, address, tokenType, balance, nonce, virtual_nonce) {
  return accountdb.create({
    account_index,
    network_id,
    pubkey,
    address,
    tokenType,
    balance,
    nonce,
    virtual_nonce
  });
};

const findOne = function (filter_dict) {
  return accountdb.findOne({ where: filter_dict });
};
const findAll = function (dict) {
  return accountdb.findAll({ where: dict });
};

const updateVirtualNonce = function(virtual_nonce, filter_dict) {
  return accountdb
    .findOne({ where: filter_dict })
    .then(function(row: any) {
      consola.log(row);
      if (row === null) {
        return false;
      }
      return row
        .update({
          virtual_nonce: virtual_nonce,
        }) // eslint-disable-next-line
        .then(function(result) {
          consola.log("Update virtual_nonce success: ", result);
          return true;
        })
        .catch(function(err) {
          consola.log("Update virtual_nonce error: ", err, virtual_nonce);
          return false;
        });
    });
};

const update = (filter_dict, value_dict) => {
  return accountdb
  .update(
      value_dict,
      {
          where: filter_dict,
      }
  )
  .then(function (result: any) {
      consola.log("Update result: ", result);
      return true;
  })
}

export { add, findOne, findAll, update, updateVirtualNonce };