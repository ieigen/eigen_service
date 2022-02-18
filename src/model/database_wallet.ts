// database_wallet.ts
/**
 * Wallet model definition
 *
 * @module database_wallet
 */

import { Sequelize, DataTypes, Op } from "sequelize";
import consola from "consola";

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

/**
 * The signer status.
 *
 * @enum
 */
export enum SignerStatus {
  None = 0,
  ToBeConfirmed = 1,
  Rejected = 2,
  Active = 3,
  Freeze = 4,
  StartRecover = 5,
  AgreeRecover = 6,
  IgnoreRecover = 7,
}

/**
 * The wallet status.
 *
 * @enum
 */
export enum WalletStatus {
  None = 0,
  Creating = 1,
  Active = 2,
  Recovering = 3,
  Fail = 4,
  Freezing = 5,
  Frozen = 6,
  Unlocking = 7,
}

// prettier-ignore
export const WALLET_STATUS_MACHINE_STATE_CHECK = [
  /* Non, Cre,   Act,   Rec,   Fai,   Fre,   Froz   Unl */
  [false, true,  false, false, false, false, false, false] /* None */,
  [false, false, true,  false, true,  false, false, false] /* Creating */,
  [false, false, false, true,  false, true,  false, false] /* Active */,
  [false, false, true,  false, false, false, false, false] /* Recovering */,
  [false, false, false, false, false, false, false, false] /* Fail */,
  [false, false, true,  false, false, false, false, false] /* Freezing */,
  [false, false, false, false, false, false, false, true ] /* Frozen */,
  [false, false, true,  false, false, false, false, false] /* Unlocking */,
];

export enum WalletStatusTransactionResult {
  Success = 0,
  Fail = 1,
}

// prettier-ignore
export const WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT = [
  /* Succ,              Fail */
  [undefined,           undefined          ] /* None */,
  [WalletStatus.Active, WalletStatus.Fail  ] /* Creating */,
  [undefined,           undefined          ] /* Active */,
  [WalletStatus.Active, WalletStatus.Fail  ] /* Recovering */,
  [undefined,           undefined          ] /* Fail */,
  [WalletStatus.Frozen, WalletStatus.Active] /* Freezing */,
  [undefined,           undefined          ] /* Frozen */,
  [WalletStatus.Active, WalletStatus.Frozen] /* Unlocking */,
];

const walletdb = sequelize.define("wallet_st", {
  wallet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }, // Only useful when the role is OWNER
  user_id: DataTypes.INTEGER, // Only useful when the role is OWNER
  name: DataTypes.STRING,
  wallet_address: DataTypes.CITEXT,
  address: DataTypes.CITEXT,
  role: DataTypes.INTEGER,
  status: DataTypes.INTEGER, // signer status
  wallet_status: DataTypes.INTEGER,
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
      status: SignerStatus.None,
    });
  })
  .then(function (row: any) {
    consola.log(
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
    consola.log("Unable to connect to the database:", err);
  });

const add = function (
  user_id,
  name,
  wallet_address,
  address,
  role,
  status,
  wallet_status
) {
  return walletdb.create({
    user_id,
    name,
    wallet_address,
    address,
    role,
    status,
    wallet_status,
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
  return walletdb.findOne({ where: filter_dict, raw: true });
};

// TODO: Some code should be refactored
const findByWalletId = function (wallet_id) {
  return walletdb.findOne({
    where: {
      wallet_id: wallet_id,
      role: WALLET_USER_ADDRESS_ROLE_OWNER,
    },
  });
};

const findOwnerWalletById = function (user_id, wallet_id) {
  return walletdb.findOne({
    where: {
      user_id: user_id,
      wallet_id: wallet_id,
      role: WALLET_USER_ADDRESS_ROLE_OWNER,
    },
    raw: true,
  });
};

const findAll = function (filter_dict) {
  return walletdb.findAll({ where: filter_dict, raw: true });
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

const updateOwnerAddress = function (user_id, wallet_id, owner_address) {
  return walletdb
    .findOne({ where: { wallet_id, user_id } })
    .then(function (row: any) {
      consola.log(row);
      if (row === null) {
        return false;
      }
      return row
        .update({
          address: owner_address,
        })
        .then(function (result) {
          consola.log("Update owner address success: ", owner_address);
          return true;
        })
        .catch(function (err) {
          consola.log(
            "Update owner address error (" + err,
            "): ",
            owner_address
          );
          return false;
        });
    });
};

const updateOrAddByOwner = function (
  user_id,
  wallet_address,
  signer_address,
  role,
  update_dict
) {
  return walletdb
    .findOne({
      where: {
        wallet_address: wallet_address,
        address: signer_address,
        role: role,
      },
    })
    .then(function (row: any) {
      if (row === null) {
        let name = update_dict.name || "";
        let status =
          update_dict.status ||
          (role == WALLET_USER_ADDRESS_ROLE_OWNER
            ? SignerStatus.None
            : SignerStatus.ToBeConfirmed);

        add(
          user_id,
          name,
          wallet_address,
          signer_address,
          role,
          status,
          WalletStatus.Creating
        );
        return true;
      }

      let actual_update_dict = {};

      if (update_dict.name !== undefined) {
        actual_update_dict["name"] = update_dict.name;
      }

      if (update_dict.status !== undefined) {
        actual_update_dict["status"] = update_dict.status;
      }

      return row
        .update(actual_update_dict)
        .then(function (result) {
          consola.log("Update success: " + JSON.stringify(result));
          return true;
        })
        .catch(function (err) {
          consola.log("Update error: " + err);
          return false;
        });
    });
};

const updateOrAddBySigner = function (
  wallet_address,
  signer_address,
  update_dict
) {
  return walletdb
    .findOne({
      where: {
        wallet_address: wallet_address,
        role: WALLET_USER_ADDRESS_ROLE_OWNER,
      },
      raw: true,
    })
    .then(function (row: any) {
      if (row === null) {
        // The signer belows no owner?
        consola.log(
          `The signer ${signer_address} want to update information, but the signer belows no owner`
        );
        return false;
      }

      let user_id = row["user_id"];
      return walletdb
        .findOne({
          where: {
            wallet_address: wallet_address,
            role: WALLET_USER_ADDRESS_ROLE_SIGNER,
            address: signer_address,
          },
        })
        .then(function (row: any) {
          if (row === null) {
            let name = update_dict.name || "";
            let status = update_dict.status || SignerStatus.ToBeConfirmed;
            add(
              user_id,
              name,
              wallet_address,
              signer_address,
              WALLET_USER_ADDRESS_ROLE_SIGNER,
              status,
              WalletStatus.None
            );
            return true;
          }

          let actual_update_dict = {};

          if (update_dict.name !== undefined) {
            actual_update_dict["name"] = update_dict.name;
          }

          if (update_dict.status !== undefined) {
            actual_update_dict["status"] = update_dict.status;
          }

          return row
            .update(actual_update_dict)
            .then(function (result) {
              consola.log("Update success: " + JSON.stringify(result));
              return true;
            })
            .catch(function (err) {
              consola.log("Update error: " + err);
              return false;
            });
        });
    });
};

const remove = function (wallet_address, signer_address, role) {
  return walletdb.destroy({
    where: { wallet_address, address: signer_address, role },
  });
};

export {
  updateOwnerAddress,
  add,
  isWalletBelongUser,
  findOne,
  findByWalletId,
  findAll,
  findAllAddresses,
  remove,
  search,
  updateOrAddByOwner,
  findOwnerWalletById,
  updateOrAddBySigner,
};
