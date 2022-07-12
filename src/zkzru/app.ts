// app.ts
/**
 * ZKZRU UI
 * @module zkzru/app
 */

import consola from "consola";
import { readFileSync } from "fs";
import * as util from "../util";
import * as txdb from "../model/zkzru_tx";
import * as accountdb from "../model/zkzru_account";
import * as tokendb from "../model/zkzru_token";
import * as blockdb from "../model/zkzru_block";
import * as depositSubTreeRootdb from "../model/zkzru_deposit";

import {parseDBData, prove, verify, proveWithdrawSignature, verifyWithdrawSignature} from "@ieigen/zkzru/operator/prover"
import { ethers } from "ethers";

import RollupNC from "../../utils/RollupNC.json";
const provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')


util.require_env_variables(["COORDINATOR_PRIVATE_KEY", "ROLLUPNC_CONTRACT_ADDRESS"])
const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY
const contractAddress = process.env.ROLLUPNC_CONTRACT_ADDRESS

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const {
  prover,
  accountHelper,
  Account,
  treeHelper,
  Transaction,
  Tree
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("@ieigen/zkzru");

const ACC_DEPTH = 4 // set 4 temporarily
const ACC_LEAVES = 2 ** ACC_DEPTH
const TXS_PER_SNARK = 4
const zeroAccount = new Account();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildMimc7 = require("circomlibjs").buildMimc7;

const zeroCache = [
  "18822210974461572787084328874970506324337552386873748437313431894257875892527", //H0 = empty leaf
  "13709419133780021201613586010693342878534544523459755321806052948713273869912",  //H1 = hash(H0, H0)
  "10979797660762940206903140898034771814264102460382043487394926534432430816033",  //H2 = hash(H1, H1)
  "4067275915489912528025923491934308489645306370025757488413758815967311850978", //...and so on
  "19452855192846597539349825891822538438453868909233030566164911148476856805886"
]

function parsePublicKey(uncompressKey) {
  const uncompressKeyStr = uncompressKey.toString()
  if (!uncompressKeyStr.startsWith("0x04")) {
    throw new Error("Invalid public key:" + uncompressKey)
  }
  const xy = uncompressKey.substr(4)
  const x = xy.substr(0, 64)
  const y = xy.substr(64)

  return {"x": x, "y": y}
}

// prove, tx submit and query
module.exports = function (app) {

    app.post("/zkzru/prove", async (req, res) => {
        // 1. get accounts and txs from db
        const network_id = req.body.network_id;
        const accountsInDB = await accountdb.findAll({})
        const txsInDB = await txdb.findOneBatchPendingTXs()

        // 2. generate proof, returns inputJson, proof
        const {accArray, txArray} = await parseDBData(accountsInDB, txsInDB)

        const result = await prove(accArray, txArray)

        let inputJsonStr;
        let publicJson;
        let proofJson;
        let data1;
        let data2;
        let data3;

        try {
          data1 = readFileSync(result["inputJson"], 'utf8');
          inputJsonStr = data1.toString()
          console.log("inputJson:", inputJsonStr)
        
          data2 = readFileSync(result["publicJson"], 'utf8');
          publicJson = data2.toString()
          console.log("publicJson:", publicJson)

          data3 = readFileSync(result["proofJson"], "utf-8");
          proofJson = data3.toString()
          console.log("proofJson:", proofJson)
        } catch (err) {
          throw err
        }

        const isValid = await verify(result['vk'], result['proof'])

        if (!isValid) {
            throw new Error(`Error: the generated proof is not valid`); 
        }

        // 3. add new block
        const blockNumber = await blockdb.nextBlockNumber()

        await blockdb.add(network_id, blockNumber, inputJsonStr, publicJson, proofJson)

        // 4. call RollupNC contract's updateState method
        const wallet = new ethers.Wallet(coordinatorPrivateKey, provider);
        console.log("RollupNC contract address:", contractAddress)
        const rollupNC = new ethers.Contract(contractAddress, RollupNC.abi, wallet)
        const updateProof = JSON.parse(data3)
        console.log("updateProof:", updateProof)
        const updatePublic = JSON.parse(data2)
        console.log("updatePublic:", updatePublic)
        const validStateUpdate = await rollupNC.updateState(
          updateProof, updatePublic
        );
        console.log("validStateUpdate:", validStateUpdate)

        // 5. update status, block_number, block_index and account balance
        const len = txsInDB.length
        for (let i = 0; i < len; i++) {
          const record = await txdb.findOne({tx_id: txsInDB[i]["tx_id"]})
          txdb.update(
            {tx_id: txsInDB[i]["tx_id"]}, 
            {status: 1, block_number: blockNumber, block_index: i+1}
          )
          .then(function (result) {
            consola.log("Update success: " + result);
          })
          .catch(function (err) {
            consola.log("Update error: " + err);
          });

          const account_record = await accountdb.findOne({"account_index": record["from_index"]})
          accountdb.update({"account_index": account_record["account_index"]}, {"nonce": account_record["virtual_nonce"]})
        }

        const mimcjs = await buildMimc7()
        const F = mimcjs.F
        const inputJson = JSON.parse(data1)
        for (let i = 0; i < len; i++) {
          const fromIndex = inputJson.fromIndex[i]
          const balanceFrom = inputJson.balanceFrom[i]
          const balanceTo = inputJson.balanceTo[i]
          const amount = inputJson.amount[i]
          const toX = inputJson.toX[i]
          const toY = inputJson.toY[i]
          accountdb.update(
            {account_index: fromIndex}, 
            {balance: balanceFrom - amount}
          )
          .then(function (result) {
            consola.log("Update sender account balance success: " + result);
          })
          .catch(function (err) {
            consola.log("Update sender account balance error: " + err);
          });
          if (toX != 0 && toY != 0) {
            const toAccountPubkey = '0x' + '04' + toHexString(F.e(toX)) + toHexString(F.e(toY))
            accountdb.update(
              {pubkey: toAccountPubkey}, 
              {balance: balanceTo + amount}
            )
            .then(function (result) {
              consola.log("Update receiver account balance success: " + result);
            })
            .catch(function (err) {
              consola.log("Update receiver account balance error: " + err);
            });
          } 
        }

        return res.json(util.Succ({blockNumber: blockNumber}))
    })

    app.post("/zkzru/proveWithdraw", async (req, res) => {
      const mimcjs = await buildMimc7();
      const F = mimcjs.F

      // 1. get account and tx from db
      const txID = req.body.tx_id;
      const withdrawTx = await txdb.findOne({tx_id: txID})
      const senderPubkey = withdrawTx["senderPubkey"]
      const senderPubkeyXY = parsePublicKey(senderPubkey)
      const x = F.toString(fromHexString(senderPubkeyXY["x"]))
      const y = F.toString(fromHexString(senderPubkeyXY["y"]))

      // get txRoot, position, proof from block
      const blockNumber = withdrawTx["block_number"]
      const blockIndex = withdrawTx["block_index"]
      const blockInfo = await blockdb.findOne({blockNumber: blockNumber})
      const blockInputJson = JSON.parse(blockInfo["inputJson"])
      const txRoot = blockInputJson.txRoot
      const position = blockInputJson.paths2txRootPos[blockIndex - 1] // the index starts with 1
      const proof = blockInputJson.paths2txRoot[blockIndex - 1]

      const txInfo = {
        pubkeyX: x,
        pubkeyY: y,
        index: withdrawTx["from_index"],
        toX: "0",
        toY: "0",
        nonce: withdrawTx["nonce"],
        amount: withdrawTx["amount"],
        token_type_from: withdrawTx["tokenTypeFrom"],
        txRoot: txRoot,
        position: position,
        proof: proof,
    }

      // 2. generate proof, returns inputJson, proof
      const sigR8x = F.e(withdrawTx["withdraw_r8x"])
      const sigR8y = F.e(withdrawTx["withdraw_r8y"])
      const sig = {
        R8: [sigR8x, sigR8y],
        S: withdrawTx["withdraw_s"]
      }
      const pubkeyXY = parsePublicKey(withdrawTx["senderPubkey"])
      const pubkey = [fromHexString(pubkeyXY["x"]), fromHexString(pubkeyXY["y"])]
      const withdrawProofResult  = await proveWithdrawSignature(
        pubkey,
        sig,
        F.e(withdrawTx["withdraw_msg"])
      )
      let withdrawProofJson;   
      try {
        const data = readFileSync(withdrawProofResult["proofJson"], "utf-8");
        withdrawProofJson = JSON.parse(data)
      } catch (err) {
        throw err
      }
      
      // verify the proof is valid
      const isValid1 = await verifyWithdrawSignature(withdrawProofResult['vk'], withdrawProofResult['proof'])
      if (!isValid1) {
          throw new Error(`Error: the generated proof is not valid`); 
      }


      return res.json(util.Succ({
        txInfo: txInfo,
        recipient: withdrawTx["recipient"],
        withdrawProof: withdrawProofJson
      }))
    })

    // insert new transaction into database
    app.post("/zkzru/tx", async(req, res) => {
        console.log(req.body)
        let result
        try {
          result = await txdb.add(
            req.body.network_id,
            req.body.from_index,
            req.body.senderPubkey,
            req.body.r8x,
            req.body.r8y,
            req.body.s,   
            req.body.receiverPubkey,
            req.body.tokenTypeFrom,
            req.body.amount,
            req.body.nonce,
            req.body.status,
            req.body.recipient,
            req.body.withdraw_r8x,
            req.body.withdraw_r8y,
            req.body.withdraw_s,
            req.body.withdraw_msg,
          )
        } catch (err) {
          console.log(err)
          throw err
        }
        
        let currentTxID
        try {
          currentTxID = await txdb.currentTxID()
        } catch (err) {
          console.log(err)
          throw err
        }
        return res.json(util.Succ(result))
    })

    app.get("/zkzru/tx/:txid", async (req, res) => {
      let filter = {}
      if (req.params.txid != "") {
          filter = {"tx_id": req.params.txid}
      }
      return res.json(util.Succ(await txdb.findAll(filter)))
    })

    app.get("/zkzru/getPendingTxsCount", async (req, res) => {
      const amount = await txdb.count({status: 0})
      return res.json(util.Succ({count: amount}))
    })

    app.post("/zkzru/block", async(req, res) => {
        let result
        try {
          result = await blockdb.add(
            req.body.network_id,
            req.body.blockNumber,
            req.body.inputJson,
            req.body.publicJson,
            req.body.proofJson
          )
        } catch(err) {
          console.log(err)
          throw err
        }
        return res.json(util.Succ(result))
    })  

    app.post("/zkzru/account", async (req, res) => {
        let result
        try { 
          result = await accountdb.add(
            req.body.network_id,
            req.body.pubkey,
            req.body.address,
            req.body.tokenType,
            req.body.balance,
            req.body.nonce,
            req.body.nonce
          )
        } catch(err) {
          console.log(err)
          throw err
        } 
        return res.json(util.Succ(result))
    })

    app.get("/zkzru/account/:address", async (req, res) => {
      let filter = {}
      if (req.params.address != "") {
          filter = {"address": req.params.address}
      }
      return res.json(util.Succ(await accountdb.findAll(filter)))
    })

    app.post("/zkzru/token", async (req, res) => {
        const result = await tokendb.add(
            res.body.network_id,
            res.body.tokenAddress,
            res.body.tokenType
        )
        return res.json(util.Succ(result))
    })

    app.post("/zkzru/depositSubTreeRoot", async (req, res) => {
      let result 
      try {
        result = await depositSubTreeRootdb.add(
          req.body.subTreeRoot,
        )
      } catch (err) {
        console.log(err)
        throw err
      } 
      return res.json(util.Succ(result))
    })

    app.get("/zkzru/getProcessDepositProof", async (req, res) => {
      // get all deposit hash in db and construct a merkle tree
      const subtreeDepth = 2
      const mimcjs = await buildMimc7();
      const F = mimcjs.F;
      await treeHelper.initialize();
      const records = await depositSubTreeRootdb.findAll({})
      
      const leafNodes = new Array(records.length)
      for (let i = 0; i < records.length; i++){
        const subTreeRoot = records[i]["subTreeRoot"]
        leafNodes[i] = F.e(subTreeRoot)
      }

      const padValue = F.e(zeroCache[subtreeDepth])

      const paddedLeafNodes = treeHelper.padArray(
        leafNodes, padValue, 2 ** (ACC_DEPTH - subtreeDepth)
      )
      
      const merkleTree = new Tree(paddedLeafNodes)
      const idx = records.length
      const {proof, proofPos} = merkleTree.getProof(idx)

      for (let j = 0; j < proof.length; j++) {
        proof[j] = F.toString(proof[j])
      }
      console.log("proof:", proof)
      console.log("proofPos", proofPos)

      return res.json(util.Succ({proof, proofPos}))
  })

  app.put("/zkzru/account/nonce", async (req, res) => {
    const address = req.body.address;
    const virtual_nonce = req.body.nonce;
    if (!util.has_value(address) || !util.has_value(virtual_nonce)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    const filter_dict = {
      address: address
    }
    const result = await accountdb.updateVirtualNonce(virtual_nonce, filter_dict);
    return res.json(util.Succ(result));
  });

  app.get("/zkzru/account/nonce/:address", async (req, res) => {
    const address = req.params.address;
    if (!util.has_value(address)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    const dict = {
      address : address
    }
    const record = await accountdb.findOne(dict)
    let result
    if ( record == null ){
      result = {
        address : address,
        nonce : 0
      }
    } else {
      result = {
        address : address,
        nonce : record['virtual_nonce']
      }
    }
    
    return res.json(util.Succ(result));
  });

  app.get("/zkzru/account/withdraw_status/:senderPubkey", async(req, res) => {
    const senderPubkey = req.params.senderPubkey;
    if (!util.has_value(senderPubkey)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }
    const filter_dict = {
      senderPubkey: senderPubkey,
      receiverPubkey: "0",
      status: txdb.tx_status.ConfirmedTx,
      withdraw_status: txdb.tx_withdraw_status.WithdrawPending
    }
    const result = await txdb.findAllOrderByCreateTime(filter_dict)
    return res.json(util.Succ(result))
  });

  app.put("/zkzru/account/withdraw_status", async (req, res) => {
    const tx_id = req.body.tx_id;
    if (!util.has_value(tx_id)) {
      return res.json(util.Err(util.ErrCode.Unknown, "missing fields"));
    }

    const withdraw_status = txdb.tx_withdraw_status.WithdrawFinish;
    const filter_dict = {
      tx_id: tx_id
    }
    const value_dict = {
      withdraw_status: withdraw_status
    }
    const result = await txdb.update(filter_dict, value_dict);
    return res.json(util.Succ(result))
  });  
}
