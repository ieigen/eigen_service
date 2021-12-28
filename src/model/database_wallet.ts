import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_wallet.sqlite",
});

export const WALLET_USER_ADDRESS_ROLE_OWNER = 0x0;
export const WALLET_USER_ADDRESS_ROLE_SIGNER = 0x1;

export const SINGER_TYPE_NONE = 0x0;
export const SINGER_TYPE_TO_BE_CONFIRMED = 0x1;
export const SINGER_TYPE_REJECTED = 0x2;
export const SINGER_TYPE_ACTIVE = 0x3;

const walletdb = sequelize.define("wallet_st", {
  wallet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  wallet_address: DataTypes.CITEXT,
  address: DataTypes.CITEXT,
  role: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
  sign_message: DataTypes.STRING,
});

sequelize
  .sync()
  .then(function () {
    return walletdb.create({
      user_id: 1,
      name: "name",
      wallet_address: "0x",
      address: "0x", // Owner or signer's address
      role: WALLET_USER_ADDRESS_ROLE_OWNER,
      status: SINGER_TYPE_NONE,
      sign_message: "",
    });
  })
  .then(function (row: any) {
    console.log(
      row.get({
        user_id: 1,
        wallet_address: "0x",
      })
    );
    walletdb.destroy({
      where: {
        user_id: row.user_id,
        wallet_address: row.wallet_address,
      },
    });
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const add = function (
  user_id,
  name,
  wallet_address,
  address,
  role,
  status,
  sign_message
) {
  return walletdb.create({
    user_id,
    name,
    wallet_address,
    address,
    role,
    status,
    sign_message,
  });
};

const findAllAddresses = function (user_id) {
  return walletdb.findAll({
    attributes: [["address", "address"]],
    where: {
      user_id,
    },
    raw: true,
  });
};

const findOne = function (filter_dict) {
  return walletdb.findOne({ where: filter_dict });
};

const findAll = function (filter_dict) {
  return walletdb.findAll({ where: filter_dict });
};

const search = function (dict) {
  return walletdb.findAll(dict);
};

const isWalletBelongUser = function (user_id, wallet_id) {
  return walletdb
    .findOne({ where: { user_id, wallet_id } })
    .then(function (row: any) {
      return row !== null;
    })
    .catch(function (err) {
      return false;
    });
};

const update = function (wallet_id, signer_address, information) {
  return walletdb
    .findOne({ where: { wallet_id, address: signer_address } })
    .then(function (row: any) {
      console.log(row);
      if (row === null) {
        return false;
      }
      return row
        .update(information)
        .then(function (result) {
          console.log("Update signer information success: ", information);
          return true;
        })
        .catch(function (err) {
          console.log(
            "Update signer information error (" + err,
            "): ",
            information
          );
          return false;
        });
    });
};

const remove = function (wallet_id, signer_address) {
  return walletdb.destroy({ where: { wallet_id, address: signer_address } });
};

export {
  update,
  add,
  isWalletBelongUser,
  findOne,
  findAll,
  findAllAddresses,
  remove,
  search,
};
