// message.ts
/**
 * Long-term session message processing
 *
 * @module message
 */

const http = require("http");
const { Server } = require("socket.io");
const consola = require("consola");
import PubSub from "pubsub-js";

import * as txh from "./model/database_transaction_history";
import * as db_wallet from "./model/database_wallet";
import { Session } from "./session";

module.exports = function (app) {
  //const server = http.createServer(app);
  const io = new Server(8080, { cors: true });

  io.on("connection", (socket) => {
    consola.info("a user connected");

    socket.emit("start", { message: "Welcome!", id: socket.id });

    socket.on("confirmed", async (data) => {
      consola.info("Confirmed: ", data);
      // {network_id, from, token, confirmed_txlist}
      // check token
      if (Session.check_token(data.token) == null) {
        consola.error("Invalid token in socket");
        return;
      }
      //update status
      let confirmed_list: string[] = data.confirmed_txlist;
      consola.info("confirmed_list: ", confirmed_list);
      for (var i = 0; i < confirmed_list.length; i++) {
        let tx = confirmed_list[i];

        let res = await txh.updateOrAdd(tx["txid"], {
          status: tx["status"],
          block_num: tx["block_num"],
        });

        if (tx["txid"] !== undefined) {
          consola.info("Publish transaction: ", tx["txid"]);

          PubSub.publish(`Transaction.${tx["txid"]}`, {
            status: tx["status"],
            block_num: tx["block_num"],
          });
        }
      }

      // get unconfirmed tx list
      let as_owners = [data.from];
      let wallets = await db_wallet.findAll({
        address: data.from,
        role: db_wallet.WALLET_USER_ADDRESS_ROLE_OWNER,
      });
      if (wallets) {
        for (let wallet of wallets) {
          as_owners.push(wallet["wallet_address"]);
        }
      }

      let confirming_list = await txh.search_with_multisig(
        as_owners,
        [],
        {
          network_id: data.network_id,
          status: txh.TransactionStatus.Sent,
        },
        0,
        10,
        false
      );
      consola.info(confirming_list);
      let txid_list: string[] = [];
      if (confirming_list.transactions) {
        for (var i = 0; i < confirming_list.transactions.length; i++) {
          consola.info(confirming_list.transactions[i]);
          txid_list.push(confirming_list.transactions[i]["txid"]);
        }
      }
      consola.info("Comfirming", txid_list);
      socket.emit("confirming", {
        unconfirmed_txlist: txid_list,
        id: socket.id,
      });
    });
  });
};
