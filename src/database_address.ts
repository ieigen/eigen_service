import { Sequelize, DataTypes } from "sequelize";
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
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
});

sequelize
  .sync()
  .then(function () {
    return addressdb.create({
      user_id: 1,
      network_id: "id",
      user_address: "0xUSER",
    });
  })
  .then(function (row: any) {
    console.log(
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
    console.log("Unable to connect to the database:", err);
  });

const add = function (user_id, network_id, user_address) {
  return addressdb.create({
    user_id,
    network_id,
    user_address,
  });
};

const findAllByUserId = function (user_id) {
  return addressdb.findAll({ where: { user_id } });
};

const updateOrAdd = function (user_id, network_id, user_address) {
  addressdb
    .findOne({ where: { user_id, network_id, user_address } })
    .then(function (row: any) {
      console.log(row);
      if (row === null) {
        add(user_id, network_id, user_address);
      }
      return true;
    });
};

export { updateOrAdd, findAllByUserId, add };
