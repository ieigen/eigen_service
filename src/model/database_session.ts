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

// database_session.ts
/**
 * Session model definition
 *
 * @module database_session
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, DataTypes } from "sequelize";
import consola from "consola";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_session.sqlite",
});

const sessiondb = sequelize.define("session_st", {
  hash_code: {
    type: DataTypes.CITEXT,
    allowNull: false,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiry: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  issue_time: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(function () {
    return sessiondb.create({
      user_id: 1,
      network_id: "id",
      user_address: "0xUSER",
      cipher_key: "0x",
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        user_id: 1,
        network_id: "id",
        user_address: "0xUSER",
      })
    );
    sessiondb.destroy({
      where: {
        user_id: row.user_id,
        network_id: row.network_id,
        user_address: row.user_address,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (hash_code, token, expiry, issue_time) {
  return sessiondb.create({
    hash_code,
    token,
    expiry,
    issue_time,
  });
};

const findOne = function (filter_dict) {
  return sessiondb.findOne({ where: filter_dict });
};
const findAll = function (dict) {
  return sessiondb.findAll({ where: dict });
};

const updateOrAdd = function (hash_code, token, expiry, issue_time) {
  return sessiondb.findOne({ where: { hash_code } }).then(function (row: any) {
    consola.log(row);
    if (row === null) {
      add(hash_code, token, expiry, issue_time);
      return true;
    }

    return row
      .update({
        hash_code,
        token,
        expiry,
        issue_time,
      })
      .then(function (result) {
        consola.log("Update seesion success: " + result);
        return true;
      })
      .catch(function (err) {
        consola.log("Update seesion error: " + err);
        return false;
      });
  });
};

const deleteSession = function (hash_code) {
  return sessiondb.destroy({ where: { hash_code: hash_code } });
};

export { updateOrAdd, add, findOne, findAll, deleteSession };
