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
