// block.ts
/**
 * block definition
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
  storage: "./data/zkzrublock_db.sqlite",
});

const l2blockdb = sequelize.define("block_st", {
  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },

  blockNumber: {
      allowNull: false,
      type: DataTypes.BIGINT,
  },

  inputJson: {
      allowNull: false,
      type: DataTypes.STRING,
  },

  publicJson: {
      allowNull: false,
      type: DataTypes.STRING,
  },

  proofJson: {
      allowNull: false,
      type: DataTypes.STRING,
  },
});

sequelize
  .sync()
  .then(function () {
    return l2blockdb.create({
      network_id: "id",
      inputJson: "100",
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        network_id: "id",
        inputJson: "100",
      })
    );
    l2blockdb.destroy({
      where: {
        network_id: "id",
        inputJson: "100",
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = async function (network_id, blockNumber, inputJson, publicJson, proofJson) {
  let res = await l2blockdb.create({
    network_id,
    blockNumber,
    inputJson,
    publicJson,
    proofJson
  });
  return res;
};

const findOne = async function (filter_dict) {
  let res = await l2blockdb.findOne({ where: filter_dict });
  return res;
};

const findAll = async function (dict) {
  let res =  l2blockdb.findAll({ where: dict });
  return res;
};

const nextBlockNumber = async () => {
    const last = await l2blockdb.findOne({
        where: { },
        order: [ [ 'createdAt', 'DESC' ]],
    });
    return last["blockNumber"] + 1
}

export { add, findOne, findAll, nextBlockNumber };
