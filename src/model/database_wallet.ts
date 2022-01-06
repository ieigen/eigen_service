import { Sequelize, DataTypes, Op } from "sequelize";
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

export const SINGER_STATUS_NONE = 0x0;
export const SINGER_STATUS_TO_BE_CONFIRMED = 0x1;
export const SINGER_STATUS_REJECTED = 0x2;
export const SINGER_STATUS_ACTIVE = 0x3;
export const SINGER_STATUS_FREEZE = 0x4;
export const SINGER_STATUS_START_RECOVER = 0x5;
export const SINGER_STATUS_AGREE_RECOVER = 0x6;
export const SINGER_STATUS_IGNORE_RECOVER = 0x7;

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
      status: SINGER_STATUS_NONE,
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
  return walletdb.findOne({ where: filter_dict, raw: true });
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

const updateOwnerAddress = function (user_id, wallet_id, owner_address) {
  return walletdb
    .findOne({ where: { wallet_id, user_id } })
    .then(function (row: any) {
      console.log(row);
      if (row === null) {
        return false;
      }
      return row
        .update({
          address: owner_address,
        })
        .then(function (result) {
          console.log("Update owner address success: ", owner_address);
          return true;
        })
        .catch(function (err) {
          console.log(
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
            ? SINGER_STATUS_NONE
            : SINGER_STATUS_TO_BE_CONFIRMED);
        let sign_message = update_dict.sign_message || "";
        add(
          user_id,
          name,
          wallet_address,
          signer_address,
          role,
          status,
          sign_message
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

      if (update_dict.sign_message !== undefined) {
        actual_update_dict["sign_message"] = update_dict.sign_message;
      }

      return row
        .update(actual_update_dict)
        .then(function (result) {
          console.log("Update success: " + JSON.stringify(result));
          return true;
        })
        .catch(function (err) {
          console.log("Update error: " + err);
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
        console.log(
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
            let status = update_dict.status || SINGER_STATUS_TO_BE_CONFIRMED;
            let sign_message = update_dict.sign_message || "";
            add(
              user_id,
              name,
              wallet_address,
              signer_address,
              WALLET_USER_ADDRESS_ROLE_SIGNER,
              status,
              sign_message
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

          if (update_dict.sign_message !== undefined) {
            actual_update_dict["sign_message"] = update_dict.sign_message;
          }

          return row
            .update(actual_update_dict)
            .then(function (result) {
              console.log("Update success: " + JSON.stringify(result));
              return true;
            })
            .catch(function (err) {
              console.log("Update error: " + err);
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

const checkSingers = function (wallet_id) {
  return (async function (wallet_id) {
    let wallet = await walletdb.findOne({
      where: {
        wallet_id: wallet_id,
        role: WALLET_USER_ADDRESS_ROLE_OWNER,
      },
      raw: true,
    });

    if (wallet === null) {
      console.log(
        "Wallet does not exist with wallet id when checking signers: ",
        wallet_id
      );
      return false;
    }

    let wallet_address = wallet["wallet_address"];

    let all_recover_signers = await walletdb.findAll({
      where: {
        wallet_address: wallet_address,
        role: WALLET_USER_ADDRESS_ROLE_SIGNER,
        status: {
          [Op.gte]: SINGER_STATUS_START_RECOVER,
        },
      },
      raw: true,
    });

    console.log(
      "checkSingers [all_recover_signers]: ",
      JSON.stringify(all_recover_signers)
    );

    let agree_recover_signers = await walletdb.findAll({
      where: {
        wallet_address: wallet_address,
        role: WALLET_USER_ADDRESS_ROLE_SIGNER,
        status: SINGER_STATUS_AGREE_RECOVER,
      },
      order: [["address", "DESC"]],
      raw: true,
    });

    console.log(
      "checkSingers [agree_recover_signers]: ",
      JSON.stringify(agree_recover_signers)
    );

    if (agree_recover_signers.length >= all_recover_signers.length / 2) {
      let sigs = getSignatures(agree_recover_signers);
      console.log("The recover sign_message could be return: ", sigs);
      return sigs;
    }

    return "";
  })(wallet_id);
};

function getSignatures(signers, returnBadSignatures = false) {
  // Sort the signers
  // Sorted when get from database
  let sortedSigners = signers;

  let sigs = "0x";
  for (let index = 0; index < sortedSigners.length; index += 1) {
    const signer = sortedSigners[index];
    let sig = signer["sign_message"];

    if (returnBadSignatures) {
      sig += "a1";
    }

    sig = sig.slice(2);
    sigs += sig;
  }
  return sigs;
}

export {
  updateOwnerAddress,
  add,
  isWalletBelongUser,
  findOne,
  findAll,
  findAllAddresses,
  remove,
  search,
  updateOrAddByOwner,
  findOwnerWalletById,
  updateOrAddBySigner,
  checkSingers,
};
