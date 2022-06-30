// deposit.ts
/**
 * deposit definition
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
  storage: "./data/zkzrudeposit_subtreeroot_db.sqlite",
});

const l2DepositSubTreeRootDB = sequelize.define("deposit_sub_tree_root_st", {
  deposit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  subTreeRoot: {
      allowNull: false,
      type: DataTypes.BIGINT,
  },
});

sequelize
  .sync()
  .then(function () {
    return l2DepositSubTreeRootDB.create({
      subTreeRoot: "15746898236136636561403648879339919593421034102197162753778420002381731361410"
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        subTreeRoot: "15746898236136636561403648879339919593421034102197162753778420002381731361410",
      })
    );
    l2DepositSubTreeRootDB.destroy({
      where: {
        subTreeRoot: "15746898236136636561403648879339919593421034102197162753778420002381731361410",      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = async function (subTreeRoot) {
  const res = await l2DepositSubTreeRootDB.create({
    subTreeRoot
  });
  return res;
};

const findOne = async function (filter_dict) {
  const res = await l2DepositSubTreeRootDB.findOne({ where: filter_dict });
  return res;
};

const findAll = async function (dict) {
  const res =  l2DepositSubTreeRootDB.findAll({ where: dict });
  return res;
};


export { add, findOne, findAll };
