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
// database_id_map.ts
/**
 * User information model definition
 *
 * @module database_id_map
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, DataTypes } from "sequelize";
import consola from "consola";

import { UserKind } from "./database_id";

const sequelize = new Sequelize({
  dialect: "sqlite",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_id_map.sqlite",
});

const idmapdb = sequelize.define("id_map_st", {
  user_id: DataTypes.INTEGER,
  value: DataTypes.STRING, // CITEXT is not proper here
  kind: DataTypes.INTEGER, // UserKind
});

sequelize
  .sync()
  .then(function () {
    return idmapdb.create({
      user_id: 0,
      value: "",
      kind: UserKind.GOOGLE,
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    idmapdb.destroy({ where: { user_id: row.user_id } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (user_info) {
  return idmapdb.create(user_info);
};

const findAll = function () {
  return idmapdb.findAll();
};

const findByValueAndKind = function (value, kind) {
  return idmapdb
    .findOne({ where: { value, kind }, raw: true })
    .then(function (row: any) {
      consola.log("Find by value and kind", row);
      return row;
    });
};

export { findAll, add, findByValueAndKind };
