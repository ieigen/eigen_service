import { type } from "os";

const { ethers } = require("ethers");
const axios = require("axios")

const ff = require("ffjavascript")
const stringifyBigInts: (obj: object) => any = ff.utils.stringifyBigInts
const buildMimc7 = require("circomlibjs").buildMimc7;

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
const BAL_DEPTH = 8
const network_id = 1;

const numAccounts = 6
const genAccount = async() => {
    console.log("genAccount");
    const tokenTypes = [2, 1, 2, 1, 2, 1];
    const balances = [1000, 20, 200, 100, 500, 20];
    const nonces = [0, 0, 0, 0, 0, 0];
    let users = [];
    for (var i = 0; i < numAccounts; i++) {
        const user = ethers.Wallet.createRandom();
        users.push(user);
    }

    // generate zero account and insert to db
    let zeroAccountUser = ethers.Wallet.createRandom()
    const zeroAccountPrvkey = zeroAccountUser.privateKey;
    const zeroAccountPubkey = await accountHelper.generatePubkey(zeroAccountPrvkey);
    let zeroAccount = new Account(
        0, zeroAccountPubkey[0], zeroAccountPubkey[1],
        0, 0, -1, zeroAccountPrvkey
    );
    await zeroAccount.initialize();
    await axios.post('http://localhost:3000/zkzru/account', {
        network_id: network_id,
        index: zeroAccount.index,
        pubkey: zeroAccountUser.publicKey,
        tokenType: -1, // zero account has no token, set tokenType = -1 and balance = 0
        balance: 0,
        nonce: 0
    }, axiosConfig)
        .then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
        console.log(error);
    });

    let accounts = [zeroAccount];
    
    // generate coordinator account and insert to db
    let coordinatorUser = ethers.Wallet.createRandom()
    const coordinatorPrvkey = coordinatorUser.privateKey;
    const coordinatorPubkey = await accountHelper.generatePubkey(coordinatorPrvkey);
    const coordinator = new Account(
        1, coordinatorPubkey[0], coordinatorPubkey[1],
        0, 0, 0, coordinatorPrvkey
    );
    await coordinator.initialize()
    await axios.post('http://localhost:3000/zkzru/account', {
        network_id: network_id,
        index: coordinator.index,
        pubkey: coordinatorUser.publicKey,
        tokenType: 0, // tokenType 0 is reserved for coordinator
        balance: 0,
        nonce: 0
    }, axiosConfig)
        .then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
        console.log(error);
    });

    accounts.push(coordinator);

    for (var i = 0; i < numAccounts; i++) {
        let user = users[i];
        const pubkey = await accountHelper.generatePubkey(user.privateKey);
        // console.log(pubkey);
        const acc = new Account(i + 2, pubkey[0], pubkey[1], balances[i], nonces[i], tokenTypes[i], users[i].privateKey);
        await acc.initialize();
        accounts.push(acc);
        await axios.post('http://localhost:3000/zkzru/account', {
            network_id: network_id,
            index: acc.index,
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
    let mimcjs = await buildMimc7();
    let F = mimcjs.F

    let zeroAccount = new Account();
    await zeroAccount.initialize();
    const fromAccountsIdx = [2, 4, 3, 1]
    const toAccountsIdx = [4, 0, 5, 0]
    const amounts = [500, 200, 10, 0]
    const txTokenTypes = [2, 2, 1, 0]
    const txNonces = [0, 0, 0, 0]

    const numLeaves = 2**BAL_DEPTH;
    const paddedAccounts = treeHelper.padArray(
        accounts, zeroAccount, numLeaves
    )

    //generate signature
    var txs = new Array(TX_DEPTH ** 2);
    for (var i = 0; i < txs.length; i++) {
        console.log("processing tx:", i)
        const fromAccount = paddedAccounts[fromAccountsIdx[i]];
        const toAccount = paddedAccounts[toAccountsIdx[i]];
        var tx = new Transaction(fromAccount.pubkeyX, fromAccount.pubkeyY, fromAccount.index, toAccount.pubkeyX, toAccount.pubkeyY, txNonces[i], amounts[i], txTokenTypes[i]);
        
        await tx.initialize()
        tx.hashTx();
        tx.signTxHash(fromAccount.prvkey);
        tx.checkSignature()

        // console.log("you got me")
        // console.log(tx.R8x)
        // console.log(typeof(tx.R8x))
        // console.log(tx.R8y)
        // console.log(typeof(tx.R8y))
        // console.log(typeof(tx.S))

        await axios.post('http://localhost:3000/zkzru/tx', {
            network_id: network_id,
            senderPubkey: ethers.utils.computePublicKey(fromAccount.prvkey),
            r8x: F.toString(tx.R8x),
            r8y: F.toString(tx.R8y),
            s: stringifyBigInts(tx.S),
            receiverPubkey: ethers.utils.computePublicKey(toAccount.prvkey),
            tokenTypeFrom: txTokenTypes[i],
            amount: amounts[i],
            nonce: txNonces[i],
            status: 0,
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
