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
  user_id: DataTypes.INTEGER,
  sender_public_key: DataTypes.CITEXT,
  sender_address: DataTypes.CITEXT,
  stealth_public_key: DataTypes.CITEXT,
  stealth_address: DataTypes.CITEXT,
  receiver_address: DataTypes.CITEXT,
  nonce: DataTypes.INTEGER,
  amount: DataTypes.STRING,
  status: DataTypes.INTEGER,
  token_name: DataTypes.STRING,
});

sequelize
  .sync()
  .then(function () {
    return sadb.create({
      message: "123",
      user_id: 1,
      sender_public_key: "0x123abc",
      sender_address: "0x123",
      stealth_public_key: "0x456qwe",
      stealth_address: "0x456",
      receiver_address: "0x890",
      nonce: 1,
      status: 1,
      amount: 10,
      token_name: "ETH",
    });
  }) // eslint-disable-next-line
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    sadb.destroy({ where: { message: row.message } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (
  message,
  user_id,
  sender_public_key,
  sender_address,
  stealth_public_key,
  stealth_address,
  receiver_address,
  nonce,
  amount,
  token_name
) {
  return sadb.create({
    message: message,
    user_id: user_id,
    sender_public_key: sender_public_key,
    sender_address: sender_address,
    stealth_public_key: stealth_public_key,
    stealth_address: stealth_address,
    receiver_address: receiver_address,
    nonce: nonce,
    status: StealthAddressStatus.NotExported,
    amount: amount,
    token_name: token_name,
  });
};

const findAll = function (filter) {
  return sadb.findAll({ where: filter });
};

const updateStatus = function (message, status) {
  // eslint-disable-next-line
  return sadb.findOne({ where: { message } }).then(function (row: any) {
    consola.log(row);
    if (row === null) {
      return false;
    }
    return row
      .update({
        status: status,
      }) // eslint-disable-next-line
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
