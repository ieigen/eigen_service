const http = require('http');
const { Server } = require("socket.io");
import * as txh from "./model/database_transaction_history";

module.exports = function (app) {
    //const server = http.createServer(app);
    const io = new Server(8080, { cors: true });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit('start', { message: 'Welcome!', id: socket.id });

        socket.on('confirmed', async (data) => {
            console.log(data)
            // {network_id, user_id, token, confirmed_txlist}
            // FIXME check token
            //update status
            let confirmed_list: string[] = data.confirmed_txlist;
            for (var txid in confirmed_list) {
                await txh.updateOrAdd(txid, {status: txh.TransactionStatus.Success})
            }

            // get unconfirmed tx list
            // FIXME query per user_id
            let confirming_list = await txh.search({network_id: data.network_id, status: txh.TransactionStatus.Sent}, 0, 10, false);
            let txid_list: string[] = []
            for (let tx in confirming_list.transactions) {
                txid_list.push(tx["txid"])
            }
            socket.emit('confirming', { unconfirmed_txlist: txid_list, id: socket.id });
        });
    });
}
