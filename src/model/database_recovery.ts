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
// database_recovery.ts
/**
 * Recovery model definition
 *
 * @module database_recovery
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
  storage: "./data/db_recovery.sqlite",
});

const recoverydb = sequelize.define("recovery_st", {
  user_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  desc: DataTypes.STRING,
  total_shared_num: DataTypes.INTEGER,
  threshold: DataTypes.INTEGER,
  friends: DataTypes.STRING, // json string for array: [{user_id, email}]
});

sequelize
  .sync()
  .then(function () {
    return recoverydb.create({
      user_id: 1,
      name: "name",
      desc: "desc",
      total_shared_num: 1,
      threshold: 1,
      friends: JSON.stringify([{ user_id: 1, email: "a@b.com" }]),
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    recoverydb.destroy({ where: { id: row.id } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (
  user_id,
  name,
  desc,
  total_shared_num,
  threshold,
  friends
) {
  return recoverydb.create({
    user_id,
    name,
    desc,
    total_shared_num,
    threshold,
    friends,
  });
};

const findByUserID = function (user_id) {
  return recoverydb.findAll({ where: { user_id: user_id } });
};

const remove = function (id) {
  return recoverydb.destroy({ where: { id: id } });
};

const updateOrAdd = function (
  user_id,
  name,
  desc,
  total_shared_num,
  threshold,
  friends
) {
  recoverydb.findOne({ where: { user_id: user_id } }).then(function (row: any) {
    consola.log(row);
    if (row === null) {
      add(user_id, name, desc, total_shared_num, threshold, friends);
      return true;
    }
    return row
      .update({
        total_shared_num,
        threshold,
        friends,
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

export { updateOrAdd, remove, findByUserID, add };
