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
