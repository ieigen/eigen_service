// wallet.ts
/**
 * Provide wallet related services
 *
 * @module wallet
 */

import PubSub from "pubsub-js";
import { Op } from "sequelize";
import consola from "consola";

import * as util from "../util";
import * as db_wallet from "../model/database_wallet";
import {
  WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT,
  WalletStatusTransactionResult,
} from "../model/database_wallet";
import * as db_address from "../model/database_address";
import * as db_user from "../model/database_id";
import * as db_txh from "../model/database_transaction_history";
import * as db_wh from "../model/database_wallet_history";
import * as db_multisig from "../model/database_multisig";

// Records txid => wallet, wallet is a Sequelize model which can be used to update status
const TRANSACTION_ADD_SIGNER_BY_OWNER_MAP = new Map();
const TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP = new Map();
const TRANSACTION_DELETE_SIGNER_MAP = new Map();

// Records a temporay wallet address
const WALLET_ADDRESS_MAP = new Map();

function addWalletStatusSubscriber(txid, wallet_id) {
  consola.log("Add wallet status subscriber: ", txid, wallet_id);
  // TRANSACTION_WALLET_MAP[txid] = wallet;

  return async function (msg, transaction) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, txid] = msg.split(".");

    const wallet = await db_wallet.findByWalletId(wallet_id);
    if (wallet === null) {
      consola.log(`Transaction ${txid} is not related to wallet ${wallet_id}`);
      return false;
    }

    const wallet_status = wallet["dataValues"]["wallet_status"];
    const transaction_status = transaction["status"];

    consola.log(
      `[addWalletStatusSubscriber]: ${txid}, ${JSON.stringify(wallet)}`
    );

    const next_status_success =
      WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT[wallet_status][
        WalletStatusTransactionResult.Success
      ];

    const next_status_fail =
      WALLET_STATUS_MACHINE_STATE_TRANSACTION_NEXT[wallet_status][
        WalletStatusTransactionResult.Fail
      ];

    if (next_status_success) {
      if (transaction_status == db_txh.TransactionStatus.Success) {
        db_wh.add(
          wallet_id,
          wallet_status,
          next_status_success,
          txid,
          db_wh.StatusTransitionCause.TransactionSuccess
        );
        // Recovering -> Active success, now we should update the owner_address
        // NOTE: Active status is updated before the Subsciber detecting the result of tx
        if (wallet_status == db_wallet.WalletStatus.Recovering) {
          const recovering_record =
            await db_wh.findLatestRecoverActionByWalletId(wallet_id);
          const new_owner_address = recovering_record["dataValues"]["data"];
          const cause = recovering_record["dataValues"]["cause"];
          consola.info(
            `${db_wh.StatusTransitionCause[cause]} success, and the owner address is going to update into: ${new_owner_address}`
          );

          // Update owner address and status of owner record
          wallet
            .update({
              wallet_status: next_status_success,
              address: new_owner_address,
            })
            .then(function (result) {
              consola.log(
                "Update wallet status success: " + JSON.stringify(result)
              );
              return true;
            })
            .catch(function (err) {
              consola.log("Update wallet status error: " + err);
              return false;
            });

          // Cancel recover or ExecuteRecover should reset the status of all signer with SignerStatus.Active
          if (
            cause == db_wh.StatusTransitionCause.GoingToCancelRecover ||
            cause == db_wh.StatusTransitionCause.GoingToRecover
          ) {
            consola.info("Reset all signers status to Active");
            db_wallet.updateAllSignersStatus(
              wallet["dataValues"]["wallet_address"],
              db_wallet.SignerStatus.Active
            );
          }
          return true;
        } else {
          if (wallet_status == db_wallet.WalletStatus.Creating) {
            // Remove tempory records about wallet_address
            consola.info(
              "Remove tempory wallt records (key): ",
              wallet["dataValues"]["address"]
            );
            WALLET_ADDRESS_MAP.delete(wallet["dataValues"]["address"]);
          }
          return wallet
            .update({
              wallet_status: next_status_success,
            })
            .then(function (result) {
              consola.log(
                "Update wallet status success: " + JSON.stringify(result)
              );
              return true;
            })
            .catch(function (err) {
              consola.log("Update wallet status error: " + err);
              return false;
            });
        }
      } else if (transaction_status == db_txh.TransactionStatus.Failed) {
        db_wh.add(
          wallet_id,
          wallet_status,
          next_status_success,
          txid,
          db_wh.StatusTransitionCause.TransactionFail
        );
        return wallet
          .update({
            wallet_status: next_status_fail,
          })
          .then(function (result) {
            consola.log(
              "Update wallet status success: " + JSON.stringify(result)
            );
            return true;
          })
          .catch(function (err) {
            consola.log("Update wallet status error: " + err);
            return false;
          });
      }
    }

    consola.log(
      `Do not handle Transaction (${txid}) and Wallet (${wallet["dataValues"]["wallet_id"]})`
    );

    return false;
  };
}

function addSignerByOwnerSubscriber(txid, data) {
  consola.log("Add signer by owner add subscriber: ", txid, data);
  TRANSACTION_ADD_SIGNER_BY_OWNER_MAP[txid] = data;
  return async function (msg, transaction) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, txid] = msg.split(".");

    const signer_data = TRANSACTION_ADD_SIGNER_BY_OWNER_MAP[txid];
    if (signer_data === undefined) {
      consola.log(`Transaction ${txid} is not related to signer`);
      return false;
    }

    consola.log(
      `[addSignerByOwnerSubscriber]: ${txid}, ${JSON.stringify(signer_data)}`
    );

    if (transaction.status == db_txh.TransactionStatus.Success) {
      await db_wallet.updateOrAddByOwner(
        signer_data.network_id,
        signer_data.wallet_address,
        signer_data.address,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        {
          name: signer_data.name,
          status: db_wallet.SignerStatus.Active,
        }
      );
    } else {
      await db_wallet.updateOrAddByOwner(
        signer_data.network_id,
        signer_data.wallet_address,
        signer_data.address,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        {
          name: signer_data.name,
          status: db_wallet.SignerStatus.Rejected,
        }
      );
    }
    return true;
  };
}

function addSignerBySignerSubscriber(txid, data) {
  consola.log("Add signer by signer add subscriber: ", txid, data);
  TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP[txid] = data;
  return async function (msg, transaction) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, txid] = msg.split(".");

    const signer_data = TRANSACTION_ADD_SIGNER_BY_SIGNER_MAP[txid];
    if (signer_data === undefined) {
      consola.log(`Transaction ${txid} is not related to signer`);
      return false;
    }

    consola.log(
      `[addSignerBySignerSubscriber]: ${txid}, ${JSON.stringify(signer_data)}`
    );

    if (transaction.status == db_txh.TransactionStatus.Success) {
      await db_wallet.updateOrAddBySigner(
        signer_data.network_id,
        signer_data.wallet_address,
        signer_data.address,
        {
          name: signer_data.name,
          status: db_wallet.SignerStatus.Active,
        }
      );
    } else {
      await db_wallet.updateOrAddBySigner(
        signer_data.network_id,
        signer_data.wallet_address,
        signer_data.address,
        {
          name: signer_data.name,
          status: db_wallet.SignerStatus.Rejected,
        }
      );
    }

    return true;
  };
}

function addDeleteSubscriber(txid, data) {
  consola.log("Delete signer by signer add subscriber: ", txid, data);
  TRANSACTION_DELETE_SIGNER_MAP[txid] = data;
  return function (msg, transaction) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, txid] = msg.split(".");

    const signer_data = TRANSACTION_DELETE_SIGNER_MAP[txid];
    if (signer_data === undefined) {
      consola.log(`Transaction ${txid} is not related to signer`);
      return false;
    }

    const transaction_status = transaction["status"];

    if (transaction_status == db_txh.TransactionStatus.Success) {
      consola.log(
        `Going to remove: wallet_address: ${data.wallet_address}, address: ${data.address}`
      );
      return db_wallet.remove(
        data.networkd_id,
        data.wallet_address,
        data.address,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER
      );
    } else {
      consola.log(
        `Fail to remove: wallet_address: ${data.wallet_address}, address: ${data.address}, mark it rejected`
      );
      return db_wallet.updateOrAddBySigner(
        data.network_id,
        data.wallet_address,
        data.address,
        {
          status: db_wallet.SignerStatus.Rejected,
        }
      );
    }
  };
}

module.exports = function (app) {
  app.post("/user/wallet", async function (req, res) {
    const wallet_address = req.body.wallet_address;
    const address = req.body.address;
    const name = req.body.name;
    const signers = req.body.signers;
    const txid = req.body.txid;
    const network_id = req.body.network_id;
    if (
      !util.has_value(address) ||
      !util.has_value(name) ||
      !util.has_value(txid) ||
      !util.has_value(network_id)
    ) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    consola.log(req.body);

    const result = await db_wallet.add(
      network_id,
      name,
      wallet_address,
      address,
      db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      db_wallet.SignerStatus.None,
      db_wallet.WalletStatus.Creating // Wallet status is submited at first
    );

    const wallet_id = result["dataValues"]["wallet_id"];

    await db_wh.add(
      wallet_id,
      db_wallet.WalletStatus.None,
      db_wallet.WalletStatus.Creating,
      txid,
      db_wh.StatusTransitionCause.Create
    );

    consola.log(
      `[[addWalletStatusSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${wallet_id})`
    );

    PubSub.subscribeOnce(
      `Transaction.${txid}`,
      addWalletStatusSubscriber(txid, wallet_id)
    );

    for (const signer of signers) {
      consola.log(`Add ${signer} into wallet ${wallet_id}]}`);
      db_wallet.add(
        network_id,
        name,
        wallet_address,
        signer,
        db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        db_wallet.SignerStatus.Active, // Signers added when wallet is added do not need to be confirmed
        db_wallet.WalletStatus.None // Wallet status is meaningless for signer
      );
    }
    res.json(util.Succ(result));
  });

  app.post("/user/wallet/:wallet_id(\\d+)", async function (req, res) {
    const wallet_id = req.params.wallet_id;

    const wallet_check = await db_wallet.findOwnerWalletById(wallet_id);

    if (wallet_check === null) {
      consola.error(`The wallet (${wallet_id}) does not exist`);
      res.json(
        util.Err(
          util.ErrCode.Unknown,
          `The wallet (${wallet_id}) does not exist`
        )
      );
      return;
    }

    const wallet = await db_wallet.findByWalletId(wallet_id);
    const wallet_status = wallet["dataValues"]["wallet_status"];

    const action = req.body.action;
    const txid = req.body.txid;
    const status = req.body.status;

    // If action is given, it means that some action is going to be launched,
    // Some pre-updated data should be recorded
    if (util.has_value(action)) {
      switch (action) {
        case "to_recover": {
          const owner_address = req.body.owner_address;
          if (!util.has_value(owner_address)) {
            consola.error(
              "to recover a wallet, a new owner_address should be given"
            );
            res.json(
              util.Err(
                util.ErrCode.Unknown,
                "to recover a wallet, a new owner_address should be given"
              )
            );
            return;
          }
          // NOTE: Waiting for the recover success, so we can not update directly:

          // const result = await db_wallet.updateOwnerAddress(
          //   wallet_id,
          //   owner_address
          // );

          // NOTE: We should add wallet history:
          consola.info(
            `Record to recover new owner_address (${wallet_id}):  ${db_wallet.WalletStatus[wallet_status]}: ${owner_address}`
          );
          // Going to recover, just record the owner_address, now there isn't txid
          await db_wh.add(
            wallet_id,
            wallet_status,
            wallet_status, // the status does not change
            "", // txid not existed, because here we just want to record owner_address
            db_wh.StatusTransitionCause.GoingToRecover,
            owner_address
          );
          break;
        }
        case "to_cancel_recover": {
          const owner_address = req.body.owner_address;
          if (!util.has_value(owner_address)) {
            consola.error(
              "to cancel recover a wallet, a new owner_address should be given"
            );
            res.json(
              util.Err(
                util.ErrCode.Unknown,
                "to cancel recover a wallet, a new owner_address should be given"
              )
            );
            return;
          }

          // We should add wallet history:

          consola.info(
            `Record to cancel recover new owner_address (${wallet_id}):  ${db_wallet.WalletStatus[wallet_status]}: ${owner_address}`
          );
          // Going to cancel recover, just record the owner_address, now there isn't txid
          await db_wh.add(
            wallet_id,
            wallet_status,
            wallet_status, // the status does not change (Active)
            "", // txid not existed, because here we just want to record owner_address
            db_wh.StatusTransitionCause.GoingToCancelRecover,
            owner_address
          );
          break;
        }
        case "to_execute_recover": {
          consola.info(
            `Record to execute recover (${wallet_id}):  ${db_wallet.WalletStatus[wallet_status]}`
          );

          if (wallet_status != db_wallet.WalletStatus.Recovering) {
            consola.error(
              `to execute recover a wallet, the current status of the wallet should be Recovering instead of ${db_wallet.WalletStatus[wallet_status]}`
            );
            res.json(
              util.Err(
                util.ErrCode.Unknown,
                `to execute recover a wallet, the current status of the wallet should be Recovering instead of ${db_wallet.WalletStatus[wallet_status]}`
              )
            );
            return;
          }
          // Going to execute recover

          await db_wh.add(
            wallet_id,
            wallet_status,
            wallet_status, // the status does not change (Recovering)
            txid,
            db_wh.StatusTransitionCause.ExecuteRecover
          );
          break;
        }

        default:
          consola.error("unsupport action: ", action);
          res.json(
            util.Err(util.ErrCode.Unknown, `unsupported action: ${action}`)
          );
          return;
          break;
      }
    }

    // NOTE: If status is given
    if (util.has_value(status)) {
      if (!db_wallet.WALLET_STATUS_MACHINE_STATE_CHECK[wallet_status][status]) {
        consola.log(
          `wallet status transition invalid: ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
        );
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            `wallet status transition invalid: ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
          )
        );
        return;
      }

      // TODO: Now we do not record Freezing or Unlocking status on the backend.
      //       In the furtue, it may be changed
      if (
        status == db_wallet.WalletStatus.Freezing ||
        status == db_wallet.WalletStatus.Unlocking
      ) {
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            `wallet status transition not supported now: ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
          )
        );
        return;
      }

      consola.info(
        `Direct update wallet status ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
      );

      // NOTE: Whether txid is given, the status is updated directly

      wallet.update({
        wallet_status: status,
      });

      // If actions is given, wallet history is added before, do not need to add history here
      if (!util.has_value(action)) {
        let cause;

        switch (status) {
          case db_wallet.WalletStatus.Creating:
            cause = db_wh.StatusTransitionCause.Create;
            break;
          case db_wallet.WalletStatus.Active:
            cause = db_wh.StatusTransitionCause.ExecuteRecover;
            break;
          default:
            cause = db_wh.StatusTransitionCause.None;
            consola.info(
              "Does not record cause: ",
              db_wh.StatusTransitionCause[status]
            );
            break;
        }

        consola.info(
          `Add wallet history: id (${wallet_id}), txid (${txid}), wallet_status (${db_wallet.WalletStatus[wallet_status]}), status (${db_wallet.WalletStatus[status]}), cause (${db_wh.StatusTransitionCause[cause]})`
        );

        if (cause != db_wh.StatusTransitionCause.None) {
          await db_wh.add(
            wallet_id,
            wallet_status,
            status,
            txid != undefined ? txid : "", // txid may be undefined
            cause
          );
        }
      }
    }

    // NOTE: If txid is given, then we should subscribe the transaction,
    //       then the status is updated when the transation is success or fail
    if (util.has_value(txid)) {
      consola.log(
        `[[addWalletStatusSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${wallet}): ${db_wallet.WalletStatus[wallet_status]} -> ${db_wallet.WalletStatus[status]}`
      );

      PubSub.subscribeOnce(
        `Transaction.${txid}`,
        addWalletStatusSubscriber(txid, wallet_id)
      );
    }

    res.json(util.Succ(true));
    return;
  });

  app.get("/user/wallets", async function (req, res) {
    consola.log("Query wallets with ", req.query);

    const address = req.query.address;
    const network_id = req.query.network_id;
    const user_id = req.query.user_id;
    const wallet_status = req.query.wallet_status;
    const recoverable_address = req.query.recoverable_address;

    if (!util.has_value(network_id)) {
      consola.error("missing network_id");
      res.json(util.Err(util.ErrCode.Unknown, "missing network_id"));
      return;
    }

    const filter_paramter_count = [user_id, address]
      .map(util.has_value)
      .map((x) => (x ? 1 : 0))
      .reduce((partial_sum, a) => partial_sum + a, 0);

    if (filter_paramter_count != 1) {
      consola.error(
        "if and only if one of user_id, address should be given ",
        filter_paramter_count
      );
      return res.json(
        util.Err(
          util.ErrCode.Unknown,
          "if and only if one of user_id, address should be given "
        )
      );
    }

    let filter;

    if (address !== undefined) {
      filter = {
        address: address,
        network_id: network_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addresses_array: any = await db_address.findAll({
        user_id: user_id,
      });
      const addresses = addresses_array.map((a) => a.user_address);

      if (wallet_status === undefined) {
        filter = {
          address: {
            [Op.in]: addresses,
          },
          network_id: network_id,
          role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
        };
      } else {
        filter = {
          address: {
            [Op.in]: addresses,
          },
          wallet_status: wallet_status,
          network_id: network_id,
          role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
        };
      }
    }

    let wallets = await db_wallet.findAll(filter);

    consola.log("Find wallets: ", wallets);

    if (util.has_value(recoverable_address)) {
      // XXX: This part can be written as a filter
      consola.info("Enable recoverable address filter");
      const valid_wallets = [];
      for (const wallet of wallets) {
        if (wallet["wallet_status"] != db_wallet.WalletStatus.Active) {
          consola.info(
            `wallet (${
              wallet["wallet_id"]
            }) should not return due to its status (${
              db_wallet.WalletStatus[wallet["wallet_status"]]
            }) is not Active`
          );
          continue;
        }

        if (wallet["address"] == recoverable_address) {
          consola.info(
            `wallet (${wallet["wallet_id"]}) should not return due to ${recoverable_address} is its owner`
          );
          continue;
        }

        const signers = await db_wallet.search({
          where: {
            wallet_address: wallet["wallet_address"],
            address: recoverable_address,
            network_id: network_id,
            role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          },
          raw: true,
        });

        consola.log(
          "Searching result about signers: ",
          JSON.stringify(signers)
        );

        if (signers.length > 0) {
          consola.info(
            `wallet (${wallet["wallet_id"]}) should not return due to ${recoverable_address} is its signer`
          );
          continue;
        }

        // OK, it is valid now, should be returned

        valid_wallets.push(wallet);
      }

      consola.info(
        "Recovable wallet should be: ",
        JSON.stringify(valid_wallets)
      );

      wallets = valid_wallets;
    }

    for (const wallet of wallets) {
      const wallet_address = wallet["wallet_address"];

      // Only Recovering wallet should return this field
      if (wallet["wallet_status"] == db_wallet.WalletStatus.Recovering) {
        consola.info(`Wallet (${wallet["wallet_id"]}) is Recovering`);
        const recovering = await db_wh.findLatestRecoveringByWalletId(
          wallet["wallet_id"]
        );

        if (recovering !== null) {
          console.log("Recovering: ", recovering);
          const new_owner_address = recovering["dataValues"]["data"];
          if (new_owner_address) {
            wallet["new_address"] = new_owner_address;
          }
        } else {
          consola.error(
            `Wallet (${wallet["wallet_id"]}) Recovering status without record?!`
          );
        }
      }

      const singer_filter = {
        wallet_address: wallet_address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      };

      const signers = await db_wallet.search({
        attributes: [
          "createdAt",
          "updatedAt",
          "name",
          "address",
          "status",
          "wallet_address",
          "network_id",
        ],
        where: singer_filter,
        raw: true,
      });
      wallet["signer_count"] = signers.length;

      // Check if the wallet has a on going tx
      const latest = await db_wh.findLatestByWalletId(wallet["wallet_id"]);
      consola.log("Latest: ", latest);
      if (
        latest !== null &&
        latest["dataValues"]["txid"] !== null &&
        latest["dataValues"]["txid"] !== ""
      ) {
        consola.info(
          `There is a tx in Wallet (${wallet["wallet_id"]}): ${
            latest["dataValues"]["txid"]
          }, the cause is ${
            db_wh.StatusTransitionCause[latest["dataValues"]["cause"]]
          }`
        );

        if (
          latest["dataValues"]["cause"] ==
            db_wh.StatusTransitionCause.TransactionSuccess ||
          latest["dataValues"]["cause"] ==
            db_wh.StatusTransitionCause.TransactionFail
        ) {
          consola.info(
            `TransactionSuccess and TransactionFail will not return txid: ${latest["dataValues"]["txid"]}`
          );
        } else {
          consola.info(
            `${
              db_wh.StatusTransitionCause[latest["dataValues"]["cause"]]
            } will return txid: ${latest["dataValues"]["txid"]}`
          );
          wallet["txid"] = latest["dataValues"]["txid"];
        }
      }

      // Return owner's name, picture and email
      const user_address = await db_address.findOne({
        user_address: wallet["address"],
      });

      if (!user_address) {
        consola.error("User address is not existed in database: ", address);
      } else {
        consola.info("Found user address record: ", user_address);
        const user_id = user_address["user_id"];

        consola.log("Searching user_id: ", user_id);

        const user = await db_user.findByID(user_id);
        if (!user) {
          consola.error("User id can not be found: ", user_id);
        } else {
          wallet["owner_name"] = user["name"];
          wallet["owner_picture"] = user["picture"];
          wallet["owner_email"] = user["email"];
        }
      }
    }

    res.json(util.Succ(wallets));
    return;
  });

  app.get("/user/as_signers", async function (req, res) {
    consola.log(req.query);

    const address = req.query.address;
    const network_id = req.query.network_id;

    if (!util.has_value(network_id) || !util.has_value(address)) {
      consola.error("missing network_id or address");
      res.json(util.Err(util.ErrCode.Unknown, "missing network_id or address"));
      return;
    }

    const arttributes = [
      "createdAt",
      "updatedAt",
      "name",
      "address",
      "status",
      "wallet_address",
      "network_id",
    ];

    const filter = {
      network_id: network_id,
      address: address,
    };

    const signers = await db_wallet.search({
      attributes: arttributes,
      where: filter,
      raw: true,
    });

    consola.log(signers);

    for (let i = 0; i < signers.length; i++) {
      const signer = signers[i];
      if (signer["role"] == db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER) continue;
      const wallet_address = signer["wallet_address"];
      const owner = await db_wallet.findOne({
        wallet_address,
        network_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });
      const owner_address = owner["address"];
      signers[i]["wallet_id"] = owner["wallet_id"];
      // Only Recovering wallet should return this field
      if (owner["wallet_status"] == db_wallet.WalletStatus.Recovering) {
        consola.info(`Wallet (${owner["wallet_id"]}) is Recovering`);
        const recovering = await db_wh.findLatestRecoveringByWalletId(
          owner["wallet_id"]
        );
        consola.log("Recovering: ", recovering);

        // If recovering exist, return it
        if (recovering !== null) {
          const new_owner_address = recovering["dataValues"]["data"];
          consola.log("New owner address", new_owner_address);
          if (new_owner_address) {
            signers[i]["old_owner_address"] = owner_address;
            consola.info("Recovering record existed: ", new_owner_address);
            signers[i]["new_owner_address"] = new_owner_address;
          } else {
            signers[i]["owner_address"] = owner_address;
          }
        } else {
          consola.error(
            `Wallet (${owner["wallet_id"]}) Recovering status without record?!`
          );
        }
      } else {
        signers[i]["owner_address"] = owner_address;
      }

      signers[i]["wallet_status"] = owner["wallet_status"];
      signers[i]["network_id"] = owner["network_id"];

      // Find the latest mtxid for recovery
      // XXX: network_id should be used to search it?

      const latest_mtxid =
        await db_multisig.findLatestRecoveryMtxidByWalletAddress(
          wallet_address
        );

      consola.log("Latest recovery mtxid: ", latest_mtxid);

      signers[i]["mtxid"] = latest_mtxid ? latest_mtxid["id"] : null;

      // Return owner's name, picture and email

      const user_address = await db_address.findOne({
        user_address: owner_address,
      });

      if (!user_address) {
        consola.error("User address is not existed in database: ", address);
      } else {
        consola.info("Found user address record: ", user_address);
        const user_id = user_address["user_id"];

        consola.log("Searching user_id: ", user_id);

        const user = await db_user.findByID(user_id);
        if (!user) {
          consola.error("User id can not be found: ", user_id);
        } else {
          signers[i]["owner_name"] = user["name"];
          signers[i]["owner_picture"] = user["picture"];
          signers[i]["owner_email"] = user["email"];
        }
      }
    }

    res.json(util.Succ(signers));
    return;
  });

  app.post("/user/wallet/:wallet_id(\\d+)/signer", async function (req, res) {
    const wallet_id = req.params.wallet_id;

    const wallet = await db_wallet.findOwnerWalletById(wallet_id);

    const network_id = req.body.network_id;

    if (!util.has_value(network_id)) {
      consola.error("missing network_id");
      res.json(util.Err(util.ErrCode.Unknown, "missing network_id"));
      return;
    }

    // Is it necessary?
    if (wallet === null) {
      consola.info(
        `It is the signer update the signer (which belongs to wallet_id: ${wallet_id}) status`
      );

      const found_wallet = await db_wallet.findOne({
        wallet_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });

      if (found_wallet === null) {
        consola.log("wallet does not exist: ", wallet_id);
        res.json(util.Err(util.ErrCode.Unknown, "wallet does not exist"));
        return;
      }

      const wallet_address = found_wallet["wallet_address"];
      const wallet_name = found_wallet["name"];
      consola.log("Wallet address found: ", wallet_address);
      consola.log("Req body: ", req.body);
      const status = req.body.status;
      const address = req.body.address;

      const txid = req.body.txid;

      // status is undefined means add a signer
      if (status === undefined) {
        if (!util.has_value(address)) {
          consola.log("address should be given");
          res.json(util.Err(util.ErrCode.Unknown, "missing fields: address"));
          return;
        }
        // Update status subscribe
        consola.log(
          `[[addSignerBySignerSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${{
            wallet_address,
            address,
            name: wallet_name,
          }})`
        );
        PubSub.subscribeOnce(
          `Transaction.${txid}`,
          addSignerBySignerSubscriber(txid, {
            wallet_address,
            address,
            name: wallet_name,
          })
        );

        return res.json(util.Succ(false));
      } else {
        // Legacy: sign_message is updated and checked here
        consola.info("Update signer by signer: ", req.body);
        await db_wallet.updateOrAddBySigner(
          network_id,
          wallet_address,
          address,
          req.body
        );

        return res.json(util.Succ(true));
      }
    } else {
      consola.log(
        `It is the owner update the signer (which belongs to wallet_id: ${wallet_id}) status`
      );
      const wallet_address = wallet["wallet_address"];
      const wallet_name = wallet["name"];
      consola.log("Wallet address found: ", wallet_address);
      consola.log("Req body: ", req.body);
      const status = req.body.status;
      const address = req.body.address;
      const txid = req.body.txid;

      // Status is undefined means add a signer!
      if (status === undefined) {
        if (!util.has_value(address) || !util.has_value(txid)) {
          consola.log("address should be given");
          res.json(
            util.Err(util.ErrCode.Unknown, "missing fields: address or txid")
          );
          return;
        }
        // Update status subscribe
        consola.log(
          `[[addSignerByOwnerSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${{
            network_id,
            wallet_address,
            address,
            name: wallet_name,
          }})`
        );

        PubSub.subscribeOnce(
          `Transaction.${txid}`,
          addSignerByOwnerSubscriber(txid, {
            network_id,
            wallet_address,
            address,
            name: wallet_name,
          })
        );

        return res.json(util.Succ(false));
      } else {
        // Legacy: sign_message is updated and checked here
        consola.info("Update signer by owner: ", req.body);
        await db_wallet.updateOrAddByOwner(
          network_id,
          wallet_address,
          address,
          db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
          req.body
        );
        return res.json(util.Succ(true));
      }
    }
  });

  app.get(
    "/user/wallet/:wallet_id(\\d+)/sign_message",
    async function (req, res) {
      const wallet_id = req.params.wallet_id;

      const address = req.query.address;
      const mtxid = req.query.mtxid;

      if (!util.has_value(address) || !util.has_value(mtxid)) {
        consola.log("address and mtxid should be given");
        res.json(
          util.Err(util.ErrCode.Unknown, "missing fields: address or mtxid")
        );
        return;
      }

      const wallet = await db_wallet.findOne({
        wallet_id,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });

      if (wallet === null) {
        consola.error("wallet_id does not exist");
        res.json(util.Err(util.ErrCode.Unknown, "wallet_id does not exist"));
        return;
      }

      const wallet_address = wallet["wallet_address"];

      const signer = await db_wallet.findOne({
        wallet_address,
        address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
      });

      if (signer === null) {
        consola.log(
          "The signer couldn't get sign_message, because it doesn't belong to the wallet"
        );
        res.json(
          util.Err(
            util.ErrCode.Unknown,
            "the signer couldn't get sign_message, because it doesn't belong to the wallet!"
          )
        );
        return;
      }

      consola.log("Request sign_mesage for a given wallet");

      const all_recover_signers = await db_wallet.findAll({
        wallet_address: wallet_address,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
        status: {
          [Op.gte]: db_wallet.SignerStatus.StartRecover,
        },
      });

      // Check if the signers is greater than 1/2
      const sign_messages = await db_multisig.getRecoverySignMessages(mtxid);

      consola.log("Sign messages: ", sign_messages);

      const sign_messages_array = sign_messages.map((x) => x["sign_message"]);

      if (sign_messages_array.length >= all_recover_signers.length / 2) {
        const sigs = db_multisig.getSignatures(sign_messages_array);
        consola.log("The recover sign_message could be return: ", sigs);
        return res.json(util.Succ(sigs));
      } else {
        return res.json(util.Succ(""));
      }
    }
  );

  app.get("/user/wallet/:wallet_id(\\d+)/signers", async function (req, res) {
    const wallet_id = req.params.wallet_id;

    consola.log("Request signers for a given wallet:", req.query);

    const wallet_filter = {
      wallet_id: wallet_id,
      role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
    };

    const wallet = await db_wallet.findOne(wallet_filter);

    if (wallet === null) {
      consola.log("wallet does not exist");
      res.json(util.Err(util.ErrCode.InvalidAuth, "wallet does not exist"));
      return;
    }

    const wallet_address = wallet["wallet_address"];

    const singer_filter = {
      wallet_address: wallet_address,
      role: db_wallet.WALLET_USER_ADDRESS_ROLE_SIGNER,
    };

    const signers = await db_wallet.search({
      attributes: [
        "createdAt",
        "updatedAt",
        ["name", "wallet_name"],
        "address",
        "status",
        "wallet_address",
        "network_id",
      ],
      where: singer_filter,
      raw: true,
    });

    consola.log(
      `Find all signers for wallet ${wallet_id}: ${JSON.stringify(signers)}`
    );

    for (const signer of signers) {
      const address = signer["address"];
      const user_address = await db_address.findOne({
        user_address: address,
      });

      if (!user_address) {
        consola.error("User address is not existed in database: ", address);
      } else {
        consola.info("Found user address record: ", user_address);
        const user_id = user_address["user_id"];

        consola.log("Searching user_id: ", user_id);

        const user = await db_user.findByID(user_id);
        if (!user) {
          consola.error("User id can not be found: ", user_id);
        } else {
          signer["name"] = user["name"];
          signer["picture"] = user["picture"];
          signer["email"] = user["email"];
        }
      }
    }

    res.json(util.Succ(signers));
    return;
  });

  app.delete("/user/wallet/:wallet_id(\\d+)/signer", async function (req, res) {
    const wallet_id = req.params.wallet_id;

    const wallet = await db_wallet.findOwnerWalletById(wallet_id);

    if (wallet === null) {
      consola.error(`wallet_id (${wallet_id}) does not exist`);
      res.json(
        util.Err(
          util.ErrCode.Unknown,
          `wallet_id (${wallet_id}) does not exist`
        )
      );
      return;
    }

    const wallet_address = wallet["wallet_address"];

    consola.log("Wallet address found: ", wallet_address);

    const address = req.body.address;
    const network_id = req.body.network_id;
    const txid = req.body.txid;

    if (
      !util.has_value(address) ||
      !util.has_value(txid) ||
      !util.has_value(network_id)
    ) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }

    consola.log(
      `[[addDeleteSubscriber]]: PubSub.subscribeOnce(Transaction.${txid}, ${{
        network_id,
        wallet_address,
        address,
      }})`
    );

    PubSub.subscribeOnce(
      `Transaction.${txid}`,
      addDeleteSubscriber(txid, {
        network_id,
        wallet_address,
        address,
      })
    );

    res.json(util.Succ(true));
  });

  app.get("/user/signers", async function (req, res) {
    consola.info("/user/signers query: ", req.query);

    const email = req.query.email;
    const address = req.query.address;

    const filter_paramter_count = [email, address]
      .map(util.has_value)
      .map((x) => (x ? 1 : 0))
      .reduce((partial_sum, a) => partial_sum + a, 0);

    if (filter_paramter_count != 1) {
      consola.error(
        "if and only if one of email, ens, address should be given ",
        filter_paramter_count
      );
      return res.json(
        util.Err(
          util.ErrCode.Unknown,
          "if and only if one of email, ens, address should be given"
        )
      );
    }

    const network_id = req.body.network_id;

    if (util.has_value(address) && !util.has_value(network_id)) {
      consola.error(
        "missing fields: address and network_id should be given both",
        address,
        network_id
      );
      return res.json(
        util.Err(
          util.ErrCode.Unknown,
          "missing fields: address and network_id should be given both"
        )
      );
    }

    if (email !== undefined) {
      const addresses = await db_user.findByEmail(email).then(function (row) {
        consola.log(row);
        if (row === null) {
          return [];
        }
        const found_user_id = row["user_id"];
        consola.log("Find user id: ", found_user_id);
        return db_address
          .findAll({
            where: { user_id: found_user_id },
            raw: true,
          })
          .then(function (rows) {
            const addresses = [];
            consola.log(rows);
            for (let i = 0; i < rows.length; i++) {
              consola.log(rows[i]);
              addresses.push(rows[i]["user_address"]);
            }
            return addresses;
          });
      });

      consola.log(addresses);

      res.json(util.Succ(addresses));
      return;
    } else if (address !== undefined) {
      // address
      const addresses = await db_wallet
        .findOne({ address, network_id })
        .then(function (row) {
          consola.log(row);
          if (row === null) {
            return [""];
          }
          return row["address"];
        });

      res.json(util.Succ([addresses]));
      return;
    }
  });

  app.get("/user/wallet_address", async function (req, res) {
    const user_address = req.query.user_address;
    if (!util.has_value(user_address)) {
      consola.error("user_address is empty");
      return res.json(util.Err(1, "user_address missing"));
    }

    const result = WALLET_ADDRESS_MAP.get(user_address);

    res.json(util.Succ(result));
  });

  app.post("/user/wallet_address", async function (req, res) {
    const user_address = req.body.user_address;
    const wallet_address = req.body.wallet_address;
    if (!util.has_value(user_address) || !util.has_value(wallet_address)) {
      consola.error("user_address or wallet_address missing");
      return res.json(util.Err(1, "user_address or wallet_address missing"));
    }

    const name = req.body.name;
    const txid = req.body.txid;
    const result = {
      wallet_address,
      name,
      txid,
    };

    WALLET_ADDRESS_MAP.set(user_address, result);

    res.json(util.Succ(result));
  });
};
