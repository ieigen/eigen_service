const { ethers } = require("ethers");
const axios = require("axios")

const {
    prover,
    accountHelper,
    Account,
    treeHelper,
    Transaction
} = require("@ieigen/zkzru");

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
};

const TX_DEPTH = 2
const BAL_DEPTH = 4
const network_id = 1;

const numAccounts = 6
const genAccount = async() => {
    console.log("genAccount")
    const tokenTypes = [2, 1, 2, 1, 2, 1];
    const balances = [1000, 20, 200, 100, 500, 20];
    const nonces = [0, 0, 0, 0, 0, 0];

    let users = []
    for (var i = 0; i < numAccounts; i ++) {
        const user = ethers.Wallet.createRandom()
        users.push(user)
    }

    let accounts = []
    for (var i = 0; i < numAccounts; i ++) {
        let user = users[i];
        const pubkey = await accountHelper.generatePubkey(user.privateKey)
        console.log(pubkey)
        const acc = new Account(
            i+1,
            pubkey[0],
            pubkey[1],
            balances[i],
            nonces[i],
            tokenTypes[i],
            users[i].privateKey
        );
        await acc.initialize()
        accounts.push(acc)

        await axios.post('http://localhost:3000/zkzru/account', {
            network_id: network_id,
            index: i + 1,
            pubkey: user.publicKey,
            tokenType: tokenTypes[i],
            balance: balances[i],
            nonce: nonces[i]
        }, axiosConfig)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return accounts;
}

const genTX = async (accounts) => {
    let zeroAccount = new Account();
    await zeroAccount.initialize();
    const fromAccountsIdx = [2, 4, 3, 1]
    const toAccountsIdx = [4, 0, 5, 0]
    const amounts = [500, 200, 10, 0]
    const txTokenTypes = [2, 2, 1, 0]
    const txNonces = [0, 0, 0, 0]

    const numLeaves = 2**BAL_DEPTH;
    const paddedAccounts = treeHelper.padArray(
        accounts, zeroAccount, numAccounts
    )

    //generate signature
    var txs = new Array(TX_DEPTH ** 2);
    for (var i = 0; i < txs.length; i++) {
        const fromAccount = paddedAccounts[fromAccountsIdx[i]]
        const toAccount = paddedAccounts[toAccountsIdx[i]];
        var tx = new Transaction(
            fromAccount.pubkeyX,
            fromAccount.pubkeyY,
            toAccount.pubkeyX,
            toAccount.pubkeyY,
            txNonces[i],
            amounts[i],
            txTokenTypes[i]
        )

        await axios.post('http://localhost:3000/zkzru/tx', {
            network_id: network_id,
            senderPubkey: accounts[fromAccountsIdx[i]].publicKey,
            receiverPubkey: accounts[toAccountsIdx[i]].publicKey,
            index: i + 1,
            amount: amounts[i],
            nonce: txNonces[i],
            tokenTypeFrom: txTokenTypes[i],
        }, axiosConfig)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


const main = async() => {
    const accs = await genAccount()
    await genTX(accs)
}

main().then(result => {
    console.log(result)
}).catch ((reason) => {
    console.log(reason)
}).finally(() => {
    console.log("Done")
})
