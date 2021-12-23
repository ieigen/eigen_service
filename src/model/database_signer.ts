import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_signer.sqlite",
});

export const SINGER_TYPE_NONE = 0x0;
export const SINGER_TYPE_TO_BE_CONFIRMED = 0x1;
export const SINGER_TYPE_REJECTED = 0x2;
export const SINGER_TYPE_ACTIVE = 0x3;

const signerdb = sequelize.define("signer_st", {
  signer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  walltet_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  address: DataTypes.STRING(64),
  ens: DataTypes.STRING,
  status: DataTypes.INTEGER,
});

sequelize
  .sync()
  .then(function () {
    return signerdb.create({
      walltet_id: 1,
      name: "name",
      address: "0x",
      ens: "name.ens",
      status: SINGER_TYPE_NONE,
    });
  })
  .then(function (row: any) {
    console.log(
      row.get({
        walltet_id: 1,
        address: "0x",
      })
    );
    signerdb.destroy({
      where: {
        walltet_id: row.walltet_id,
        address: row.address,
      },
    });
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const add = function (walltet_id, name, address, ens) {
  return signerdb.create({
    walltet_id,
    name,
    address,
    ens,
    status: SINGER_TYPE_TO_BE_CONFIRMED,
  });
};

const search = function (filter_dict) {
  return signerdb.findAll({ where: filter_dict });
};

const updateOrAdd = function (walltet_id, name, address, ens) {
  return signerdb
    .findOne({ where: { walltet_id, address } })
    .then(function (row: any) {
      console.log(row);
      if (row === null) {
        return add(walltet_id, name, address, ens);
      }
      return row
        .update({
          name: name,
          ens: ens,
        })
        .then(function (result) {
          console.log("Update success: " + JSON.stringify(result));
          return row;
        })
        .catch(function (err) {
          console.log("Update error: " + err);
          return row;
        });
    });
};

const updateStatus = function (walltet_id, signer_id, status) {
  return signerdb
    .findOne({ where: { walltet_id, signer_id } })
    .then(function (row: any) {
      console.log(row);
      if (row === null) {
        return false;
      }
      return row
        .update({
          status,
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

const remove = function (walltet_id, signer_id) {
  return signerdb.destroy({ where: { walltet_id, signer_id } });
};

export { updateOrAdd, search, add, updateStatus, remove };
