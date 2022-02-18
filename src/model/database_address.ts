// database_addresses.ts
/**
 * Addresses model definition
 *
 * @module database_addresses
 */

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
  storage: "./data/db_address.sqlite",
});

const addressdb = sequelize.define("address_st", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },

  user_address: {
    type: DataTypes.CITEXT,
    allowNull: false,
    primaryKey: true,
  },

  cipher_key: {
    allowNull: false,

    type: DataTypes.STRING,
  },
});

sequelize
  .sync()
  .then(function () {
    return addressdb.create({
      user_id: 1,
      network_id: "id",
      user_address: "0xUSER",
      cipher_key: "0x",
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        usr_id: 1,
        network_id: "id",
        user_address: "0xUSER",
      })
    );
    addressdb.destroy({
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

const add = function (user_id, network_id, user_address, cipher_key) {
  return addressdb.create({
    user_id,
    network_id,
    user_address,
    cipher_key,
  });
};

const findOne = function (filter_dict) {
  return addressdb.findOne({ where: filter_dict });
};
const findAll = function (dict) {
  return addressdb.findAll({ where: dict });
};

const updateOrAdd = function (user_id, network_id, user_address, cipher_key) {
  addressdb
    .findOne({ where: { user_id, network_id, user_address } })
    .then(function (row: any) {
      consola.log(row);
      if (row === null) {
        add(user_id, network_id, user_address, cipher_key);
      }
      return true;
    });
};

export { updateOrAdd, add, findOne, findAll };
