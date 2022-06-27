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

// allowance.ts
/**
 * Allowance management model definition
 *
 * @module database_allowance
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers } from "ethers";
import { Sequelize, Op, DataTypes } from "sequelize";
import consola from "consola";

import * as CONSTANTS from "./constants";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_token_allowance.sqlite",
});

const token_allowance_db = sequelize.define("token_allowance_st", {
  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  token_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  user_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  // FIXME: swap_address name should be changed
  swap_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  allowance: DataTypes.STRING,
});

sequelize
  .sync()
  .then(function () {
    return token_allowance_db.create({
      network_id: "_network_id",
      token_address: "0xTOKEN",
      user_address: "0xUSER",
      swap_address: "0xSWAP",
      allowance: 0,
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    token_allowance_db.destroy({
      where: {
        network_id: row.network_id,
        token_address: row.token_address,
        user_address: row.user_address,
        swap_address: row.swap_address,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (
  network_id,
  token_address,
  user_address,
  swap_address,
  allowance
) {
  return token_allowance_db.create({
    network_id: network_id,
    token_address: token_address,
    user_address: user_address,
    swap_address: swap_address,
    allowance: allowance,
  });
};

const updateOrAdd = function (
  network_id,
  token_address,
  user_address,
  swap_address,
  allowance
) {
  token_allowance_db
    .findOne({
      where: {
        network_id: network_id,
        token_address: token_address,
        user_address: user_address,
        swap_address: swap_address,
      },
    })
    .then(function (row: any) {
      consola.log(row);
      if (row === null) {
        add(network_id, token_address, user_address, swap_address, allowance);
        return true;
      }
      return row
        .update({
          network_id,
          token_address,
          user_address,
          swap_address,
          allowance,
        })
        .then(function (result) {
          consola.log("Update success: " + result);
          return true;
        })
        .catch(function (err) {
          consola.log("Update error: " + err);
          return false;
        });
    });
};

const get = function (network_id, token_address, user_address, swap_address) {
  return token_allowance_db.findOne({
    where: { network_id, token_address, user_address, swap_address },
  });
};

const findAllAllowancesGreaterThanZero = function (network_id, user_address) {
  return token_allowance_db.findAll({
    attributes: [
      "network_id",
      "token_address",
      "user_address",
      "swap_address",
      "allowance",
      "updatedAt",
    ],
    where: {
      network_id: network_id,
      user_address: user_address,
      allowance: {
        [Op.not]: "0",
      },
    },
    raw: true,
  });
};

export { updateOrAdd, get, add, findAllAllowancesGreaterThanZero };

// TODO: Implement a background search for all the allowance when needed
export const get_allowance = function (
  network,
  user_address,
  token_address,
  swap_address
) {
  const provider = ethers.getDefaultProvider(CONSTANTS.getRpcUrl(network));
  consola.log("Provider: ", provider);

  const token = new ethers.Contract(
    token_address,
    CONSTANTS.ERC20_ALLOWANCE_ABI,
    provider
  );
  consola.log("erc20: ", token);

  token.allowance(user_address, swap_address).then(function (res) {
    consola.log(res);
    return res;
  });
};
