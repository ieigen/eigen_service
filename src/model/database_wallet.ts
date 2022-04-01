// database_wallet.ts
/**
 * Wallet model definition
 *
 * @module database_wallet
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
  [false, false, true,  true,  false, true,  false, false] /* Active */,
  [false, false, true,  true,  false, false, false, false] /* Recovering */,
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
  [undefined,           undefined              ] /* None */,
  [WalletStatus.Active, WalletStatus.Fail      ] /* Creating */,
  [WalletStatus.Active, WalletStatus.Active    ] /* Active */,
  [WalletStatus.Active, WalletStatus.Recovering] /* Recovering */,
  [undefined,           undefined              ] /* Fail */,
  [WalletStatus.Frozen, WalletStatus.Active    ] /* Freezing */,
  [undefined,           undefined              ] /* Frozen */,
  [WalletStatus.Active, WalletStatus.Frozen    ] /* Unlocking */,
];

const walletdb = sequelize.define("wallet_st", {
  wallet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }, // Only useful when the role is OWNER
  network_id: DataTypes.STRING(64),
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
      network_id: "1",
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
        network_id: "1",
        wallet_address: "0x",
      })
    );
    walletdb.destroy({
      where: {
        network_id: row.network_id,
        wallet_address: row.wallet_address,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (
  network_id,
  name,
  wallet_address,
  address,
  role,
  status,
  wallet_status
) {
  return walletdb.create({
    network_id,
    name,
    wallet_address,
    address,
    role,
    status,
    wallet_status,
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

const findOwnerWalletById = function (wallet_id) {
  return walletdb.findOne({
    where: {
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

const updateOwnerAddress = function (wallet_id, owner_address) {
  return walletdb.findOne({ where: { wallet_id } }).then(function (row: any) {
    consola.log(row);
    if (row === null) {
      return false;
    }
    return row
      .update({
        address: owner_address,
      })
      .then(function (result) {
        consola.log("Update owner address success: ", owner_address, result);
        return true;
      })
      .catch(function (err) {
        consola.log("Update owner address error (" + err, "): ", owner_address);
        return false;
      });
  });
};

const updateAllOwnerAddresses = function (wallet_address, owner_address) {
  return walletdb
    .findAll({ where: { wallet_address } })
    .then(function (rows: any) {
      consola.log(rows);
      if (rows === null) {
        return false;
      }
      return rows.forEach(function (row: any) {
        row
          .update({
            address: owner_address,
          })
          .then(function (result) {
            consola.log(
              "Update owner address success: ",
              owner_address,
              result
            );
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
    });
};

const updateAllSignersStatus = function (wallet_address, status) {
  return walletdb
    .findAll({
      where: { wallet_address, role: WALLET_USER_ADDRESS_ROLE_SIGNER },
    })
    .then(function (rows: any) {
      consola.log(rows);
      if (rows === null) {
        return false;
      }
      return rows.forEach(function (row: any) {
        row
          .update({
            status,
          })
          .then(function (result) {
            consola.log("Update signer status success: ", status, result);
            return true;
          })
          .catch(function (err) {
            consola.log("Updatesigner statuss error (" + err, "): ", status);
            return false;
          });
      });
    });
};

const updateOrAddByOwner = function (
  network_id,
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
        const name = update_dict.name;
        consola.log("Add signer by owner with wallet name: ", name);
        const status =
          update_dict.status ||
          (role == WALLET_USER_ADDRESS_ROLE_OWNER
            ? SignerStatus.None
            : SignerStatus.ToBeConfirmed);

        add(
          network_id,
          name,
          wallet_address,
          signer_address,
          role,
          status,
          WalletStatus.Creating
        );
        return true;
      }

      const actual_update_dict = {};

      if (update_dict.name !== undefined) {
        actual_update_dict["name"] = update_dict.name;
      }

      if (update_dict.status !== undefined) {
        actual_update_dict["status"] = update_dict.status;
      }

      consola.log("Update signer by owner: ", update_dict);

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
  network_id,
  wallet_address,
  signer_address,
  update_dict
) {
  return walletdb
    .findOne({
      where: {
        network_id: network_id,
        wallet_address: wallet_address,
        role: WALLET_USER_ADDRESS_ROLE_OWNER,
      },
      raw: true,
    })
    .then(function (owner_row: any) {
      if (owner_row === null) {
        // The signer belows no owner?
        consola.log(
          `The signer ${signer_address} want to update information, but the signer belows no owner`
        );
        return false;
      }

      const network_id = owner_row["network_id"];
      const wallet_name = owner_row["name"];
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
            // NOTE: name should be set here
            const name = update_dict.name || wallet_name;
            consola.log("Add signer by signer with wallet name: ", name);
            const status = update_dict.status || SignerStatus.ToBeConfirmed;
            add(
              network_id,
              name,
              wallet_address,
              signer_address,
              WALLET_USER_ADDRESS_ROLE_SIGNER,
              status,
              WalletStatus.None
            );
            return true;
          }

          const actual_update_dict = {};

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

const remove = function (network_id, wallet_address, signer_address, role) {
  return walletdb.destroy({
    where: { network_id, wallet_address, address: signer_address, role },
  });
};

export {
  updateOwnerAddress,
  add,
  findOne,
  findByWalletId,
  findAll,
  remove,
  search,
  updateOrAddByOwner,
  findOwnerWalletById,
  updateOrAddBySigner,
  updateAllOwnerAddresses,
  updateAllSignersStatus,
};
