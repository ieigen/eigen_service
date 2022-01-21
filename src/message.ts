const http = require("http");
const { Server } = require("socket.io");
import * as txh from "./model/database_transaction_history";
import { Session } from "./session";
import PubSub from "pubsub-js";

module.exports = function (app) {
  //const server = http.createServer(app);
  const io = new Server(8080, { cors: true });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.emit("start", { message: "Welcome!", id: socket.id });

    socket.on("confirmed", async (data) => {
      console.log(data);
      // {network_id, from, token, confirmed_txlist}
      // check token
      if (Session.check_token(data.token) == null) {
        console.log("Invalid token in socket");
        return;
      }
      //update status
      let confirmed_list: string[] = data.confirmed_txlist;
      console.log("confirmed_list", confirmed_list);
      for (var i = 0; i < confirmed_list.length; i++) {
        let tx = confirmed_list[i];

        let res = await txh.updateOrAdd(tx["txid"], {
          status: tx["status"],
          block_num: tx["block_num"],
        });

        if (tx["txid"] !== undefined) {
          console.log("Publish transaction: ", tx["txid"]);

          PubSub.publish(`Transaction.${tx["txid"]}`, {
            status: tx["status"],
            block_num: tx["block_num"],
          });
        }
      }

      // get unconfirmed tx list
      let confirming_list = await txh.search(
        {
          network_id: data.network_id,
          from: data.from,
          status: txh.TransactionStatus.Sent,
        },
        0,
        10,
        false
      );
      console.log(confirming_list);
      let txid_list: string[] = [];
      for (var i = 0; i < confirming_list.transactions.length; i++) {
        console.log(confirming_list.transactions[i]);
        txid_list.push(confirming_list.transactions[i]["txid"]);
      }
      console.log("Comfirming", txid_list);
      socket.emit("confirming", {
        unconfirmed_txlist: txid_list,
        id: socket.id,
      });
    });
  });
};
