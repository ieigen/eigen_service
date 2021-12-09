import { ethers } from "ethers";
import { format } from "path/posix";
import { Sequelize, Op, DataTypes } from "sequelize";

import * as CONSTANTS from "./constants";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_token_allowance.sqlite",
});

const token_allowance_db = sequelize.define("token_allowance_st", {
  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  token_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  user_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  // FIXME: swap_address name should be changed
  swap_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  allowance: DataTypes.STRING,
});

sequelize
  .sync()
  .then(function () {
    return token_allowance_db.create({
      network_id: "_network_id",
      token_address: "0xTOKEN",
      user_address: "0xUSER",
      swap_address: "0xSWAP",
      allowance: 0,
    });
  })
  .then(function (row: any) {
    console.log(
      row.get({
        plain: true,
      })
    );
    token_allowance_db.destroy({
      where: {
        network_id: row.network_id,
        token_address: row.token_address,
        user_address: row.user_address,
        swap_address: row.swap_address,
      },
    });
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const add = function (
  network_id,
  token_address,
  user_address,
  swap_address,
  allowance
) {
  return token_allowance_db.create({
    network_id: network_id,
    token_address: token_address,
    user_address: user_address,
    swap_address: swap_address,
    allowance: allowance,
  });
};

const updateOrAdd = function (
  network_id,
  token_address,
  user_address,
  swap_address,
  allowance
) {
  token_allowance_db
    .findOne({
      where: {
        network_id: network_id,
        token_address: token_address,
        user_address: user_address,
        swap_address: swap_address,
      },
    })
    .then(function (row: any) {
      console.log(row);
      if (row === null) {
        add(network_id, token_address, user_address, swap_address, allowance);
        return true;
      }
      return row
        .update({
          network_id,
          token_address,
          user_address,
          swap_address,
          allowance,
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

const get = function (network_id, token_address, user_address, swap_address) {
  return token_allowance_db.findOne({
    where: { network_id, token_address, user_address, swap_address },
  });
};

const findAllAllowancesGreaterThanZero = function (network_id, user_address) {
  return token_allowance_db.findAll({
    attributes: [
      "network_id",
      "token_address",
      "user_address",
      "swap_address",
      "allowance",
      "updatedAt",
    ],
    where: {
      network_id: network_id,
      user_address: user_address,
      allowance: {
        [Op.not]: "0",
      },
    },
    raw: true,
  });
};

export { updateOrAdd, get, add, findAllAllowancesGreaterThanZero };

// TODO: Implement a background search for all the allowance when needed
export const get_allowance = function (
  network,
  user_address,
  token_address,
  swap_address
) {
  let provider = ethers.getDefaultProvider(CONSTANTS.getRpcUrl(network));
  console.log("Provider: ", provider);

  const token = new ethers.Contract(
    token_address,
    CONSTANTS.ERC20_ALLOWANCE_ABI,
    provider
  );
  console.log("erc20: ", token);

  token.allowance(user_address, swap_address).then(function (res) {
    console.log(res);
    return res;
  });
};

const get_allowances_for_all_tokens_on_a_network = async function (
  network,
  user_address,
  swap_address
) {
  let provider = ethers.getDefaultProvider(CONSTANTS.getRpcUrl(network));
  console.log("Provider: ", provider);

  for (let token_info in CONSTANTS.mainnet_tokens.tokens) {
    // const token = new ethers.Contract(token_info.address, ERC20_ABI, provider);
    // console.log("erc20: ", token);
    // token.allowance(user_address, swap_address).then(function (res) {
    //   console.log(res);
    //   return res;
    // });
    console.log(token_info);
  }
};
