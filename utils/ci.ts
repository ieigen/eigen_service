import { encode } from "punycode";

const { ethers } = require("ethers");
const axios = require("axios")

const ff = require("ffjavascript")
const stringifyBigInts = ff.utils.stringifyBigInts
const buildMimc7 = require("circomlibjs").buildMimc7;

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

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

function generatePrvkey(i){
    let prvkey = Buffer.from(i.toString().padStart(64,'0'), "hex");
    return prvkey;
}

function encodePublicKey(x, y){
    return '0x' + '04' + toHexString(x) + toHexString(y)
}

const TX_DEPTH = 2
const BAL_DEPTH = 8
const network_id = 1;

const numAccounts = 6
const genAccount = async() => {
    console.log("genAccount");
    const tokenTypes = [2, 1, 2, 1, 2, 1];
    const balances = [1000, 20, 200, 100, 500, 20];
    const nonces = [0, 0, 0, 0, 0, 0];

    let zeroAccount = new Account();
    await zeroAccount.initialize();
    await axios.post('http://localhost:3000/zkzru/account', {
        network_id: network_id,
        index: zeroAccount.index,
        pubkey: "0",
        address: "0",
        tokenType: 0,
        balance: 0,
        nonce: 0,
        prvkey: "0"
    }, axiosConfig)
        .then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
        console.log(error);
    });

    let accounts = [zeroAccount];
    
    const coordinatorPrvkey = generatePrvkey(1);
    const coordinatorPubkey = await accountHelper.generatePubkey(coordinatorPrvkey);
    const coordinator = new Account(
        1, coordinatorPubkey[0], coordinatorPubkey[1],
        0, 0, 0, coordinatorPrvkey
    );
    const coordinatorPubkeyUncompressed = '0x' + '04' + toHexString(coordinatorPubkey[0]) + toHexString(coordinatorPubkey[1]);
    await coordinator.initialize()
    await axios.post('http://localhost:3000/zkzru/account', {
        network_id: network_id,
        index: coordinator.index,
        pubkey: coordinatorPubkeyUncompressed,
        address: ethers.utils.computeAddress(coordinatorPubkeyUncompressed),
        tokenType: 0, // tokenType 0 is reserved for coordinator
        balance: 0,
        nonce: 0,
        prvkey: coordinatorPrvkey.toString('hex')
    }, axiosConfig)
        .then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
        console.log(error);
    });

    accounts.push(coordinator);

    for (var i = 0; i < numAccounts; i++) {
        let privateKey = generatePrvkey(i+2)
        const pubkey = await accountHelper.generatePubkey(privateKey);
        const pubkeyUncompressed = '0x' + '04' + toHexString(pubkey[0]) + toHexString(pubkey[1])
        const acc = new Account(i + 2, pubkey[0], pubkey[1], balances[i], nonces[i], tokenTypes[i], privateKey);
        await acc.initialize();
        accounts.push(acc);
        await axios.post('http://localhost:3000/zkzru/account', {
            network_id: network_id,
            index: acc.index,
            pubkey: pubkeyUncompressed,
            address: ethers.utils.computeAddress(pubkeyUncompressed),
            tokenType: tokenTypes[i],
            balance: balances[i],
            nonce: nonces[i],
            prvkey: privateKey.toString('hex')
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

        let senderPubkey;
        let receiverPubkey;
        let recipient;
        let withdraw_r8x;
        let withdraw_r8y;
        let withdraw_s;
        let withdraw_msg
        if (tx.fromX == 0 && tx.fromY == 0) {
            senderPubkey = '0'
        } else {
            senderPubkey = '0x' + '04' + toHexString(tx.fromX) + toHexString(tx.fromY)
        }
        if (tx.toX == 0 && tx.toY == 0) {
            receiverPubkey = '0'
        } else {
            receiverPubkey = '0x' + '04' + toHexString(tx.toX) + toHexString(tx.toY)
        }
        await axios.post('http://localhost:3000/zkzru/tx', {
            network_id: network_id,
            from_index: fromAccount.index,
            senderPubkey: senderPubkey,
            r8x: toHexString(tx.R8x),
            r8y: toHexString(tx.R8y),
            s: stringifyBigInts(tx.S),
            receiverPubkey: receiverPubkey,
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