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

const walletdb = sequelize.define("wallet_st", {
  wallet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  address: DataTypes.STRING(64),
  ens: DataTypes.STRING,
});

sequelize
  .sync()
  .then(function () {
    return walletdb.create({
      user_id: 1,
      name: "name",
      address: "0x",
      ens: "name.ens",
    });
  })
  .then(function (row: any) {
    console.log(
      row.get({
        user_id: 1,
        address: "0x",
      })
    );
    walletdb.destroy({
      where: {
        user_id: row.user_id,
        address: row.address,
      },
    });
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const add = function (user_id, name, address, ens) {
  return walletdb.create({
    user_id,
    name,
    address,
    ens,
  });
};

const search = function (filter_dict) {
  return walletdb.findAll({ where: filter_dict });
};

const updateOrAdd = function (user_id, name, address, ens) {
  walletdb.findOne({ where: { user_id, address } }).then(function (row: any) {
    console.log(row);
    if (row === null) {
      return add(user_id, name, address, ens);
    }
    return row
      .update({
        name: name,
        ens: ens,
      })
      .then(function (result) {
        console.log("Update success: " + result);
        return true;
      })
      .catch(function (err) {
        console.log("Update error: " + err);
        return false;
      });
  });
};

export { updateOrAdd, search, add };
