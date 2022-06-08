import { Sequelize, Op, DataTypes, Order } from "sequelize";
import consola from "consola";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_stealth_address.sqlite",
});

export enum StealthAddressStatus {
  NotExported = 0,
  Exporting = 1,
  HasExported = 2,
}

const sadb = sequelize.define("stealth_address_st", {
  message: {
    type: DataTypes.CITEXT,
    allowNull: false,
    unique: true,
  },
  sender_public_key: DataTypes.CITEXT,
  sender_address: DataTypes.CITEXT,
  receiver_address: DataTypes.CITEXT,
  nonce: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
});

sequelize
  .sync()
  .then(function () {
    return sadb.create({});
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    sadb.destroy({ where: { txid: row.txid } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (
  message,
  sender_public_key,
  sender_address,
  receiver_address,
  nonce
) {
  return sadb.create({
    message: message,
    sender_public_key: sender_public_key,
    sender_address: sender_address,
    receiver_address: receiver_address,
    nonce: nonce,
    status: StealthAddressStatus.NotExported,
  });
};

const findAll = function (filter) {
  return sadb.findAll(filter);
};

const updateStatus = function (message, status) {
  return sadb.findOne({ where: { message } }).then(function (row: any) {
    consola.log(row);
    if (row === null) {
      return false;
    }
    return row
      .update({
        status: status,
      })
      .then(function (result) {
        consola.log("Update stealth address status success: ", status, result);
        return true;
      })
      .catch(function (err) {
        consola.log("Update stealth address status error: ", err, status);
        return false;
      });
  });
};

export { add, findAll, updateStatus };
