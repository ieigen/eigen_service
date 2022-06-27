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
// database_pk.ts
/**
 * Public key model definition
 *
 * @module database_pk
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
  storage: "./data/db_pk.sqlite",
});

const pkdb = sequelize.define("pk_st", {
  digest: DataTypes.STRING(64),
  public_key: DataTypes.STRING,
});

sequelize
  .sync()
  .then(function () {
    return pkdb.create({
      digest: "eigen__",
      public_key: "eigne__",
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    pkdb.destroy({ where: { digest: row.digest } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (digest, pk) {
  return pkdb.create({
    digest,
    public_key: pk,
  });
};

const findByDigest = function (dig) {
  return pkdb.findOne({ where: { digest: dig } });
};

const findAll = function () {
  return pkdb.findAll();
};

const updateOrAdd = function (old_dig, new_dig, new_pk) {
  pkdb.findOne({ where: { digest: old_dig } }).then(function (row: any) {
    consola.log(row);
    if (row === null) {
      add(new_dig, new_pk);
      return true;
    }
    return row
      .update({
        digest: new_dig,
        public_key: new_pk,
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

export { updateOrAdd, findAll, findByDigest, add };
