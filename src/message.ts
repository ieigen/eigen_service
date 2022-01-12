const http = require('http');
const { Server } = require("socket.io");
import * as txh from "./model/database_transaction_history";

module.exports = function (app) {
    //const server = http.createServer(app);
    const io = new Server(8080);

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit('start', { message: 'Welcome!', id: socket.id });

        socket.on('confirmed', async (data) => {
            console.log(data)
            //update status
            let confirmed_list: string[] = data.txhashlist;
            for (var txid in confirmed_list) {
                await txh.updateOrAdd(txid, {status: txh.TransactionStatus.Success})
            }

            // get unconfirmed tx list
            let confirming_list = await txh.search({network_id: data.network_id, status: txh.TransactionStatus.Sent}, 0, 10, false);
            let txid_list: string[] = []
            for (let tx in confirming_list.transactions) {
                txid_list.push(tx["txid"])
            }
            socket.emit('confirming', { txhashlist: txid_list, id: socket.id });
        });

        socket.on('confirming', async (data) => {
            console.log(data)

            // get unconfirmed tx list
            let confirming_list = await txh.search({network_id: data.network_id, status: txh.TransactionStatus.Sent}, 0, 10, false);
            let txid_list: string[] = []
            for (let tx in confirming_list.transactions) {
                txid_list.push(tx["txid"])
            }
            socket.emit('confirming', { txhashlist: txid_list, id: socket.id });
        });
    });
}
