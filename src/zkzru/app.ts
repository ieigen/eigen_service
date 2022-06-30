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

const contractAddress = "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E";

// TODO: change the proverPrivateKey
const coordinatorPrivateKey = "0x111"

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const {
  prover,
  accountHelper,
  Account,
  treeHelper,
  Transaction,
  Tree
} = require("@ieigen/zkzru");

const ACC_DEPTH = 4 // set 4 temporarily
const ACC_LEAVES = 2 ** ACC_DEPTH
const TXS_PER_SNARK = 4
const zeroAccount = new Account();

const buildMimc7 = require("circomlibjs").buildMimc7;

const zeroCache = [
  "18822210974461572787084328874970506324337552386873748437313431894257875892527", //H0 = empty leaf
  "13709419133780021201613586010693342878534544523459755321806052948713273869912",  //H1 = hash(H0, H0)
  "10979797660762940206903140898034771814264102460382043487394926534432430816033",  //H2 = hash(H1, H1)
  "4067275915489912528025923491934308489645306370025757488413758815967311850978", //...and so on
  "19452855192846597539349825891822538438453868909233030566164911148476856805886"
]

function parsePublicKey(uncompressKey) {
  let uncompressKeyStr = uncompressKey.toString()
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

        let inputJson;
        let publicJson;
        let proofJson;
        let data1;
        let data2;
        let data3;

        try {
          data1 = readFileSync(result["inputJson"], 'utf8');
          inputJson = data1.toString()
        
          data2 = readFileSync(result["publicJson"], 'utf8');
          publicJson = data2.toString()

          data3 = readFileSync(result["proofJson"], "utf-8");
          proofJson = data3.toString()
        } catch (err) {
          throw err
        }

        const isValid = await verify(result['vk'], result['proof'])

        if (!isValid) {
            throw new Error(`Error: the generated proof is not valid`); 
        }

        // 3. add new block
        const blockNumber = await blockdb.nextBlockNumber()

        blockdb.add(network_id, blockNumber, inputJson, publicJson, proofJson)

        // 4. call RollupNC contract's updateState method
        let wallet = new ethers.Wallet(coordinatorPrivateKey, provider);
        let rollupNC = new ethers.Contract(contractAddress, abi, wallet)
        let updateProof = JSON.parse(data3)
        console.log("updateProof:", updateProof)
        let updateInput = JSON.parse(data1)
        console.log("updateInput:", updateInput)
        let validStateUpdate = await rollupNC.updateState(
          updateProof, updateInput
        );
        console.log("validStateUpdate:", validStateUpdate)

        // 5. update status and block_number and block_index
        for (var i = 0; i < txsInDB.length; i++) {
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
        }
        return res.json(util.Succ({blockNumber: blockNumber}))
    })

    app.post("/zkzru/proveWithdraw", async (req, res) => {
      let mimcjs = await buildMimc7();
      let F = mimcjs.F

      // 1. get account and tx from db
      const txID = req.body.tx_id;
      const withdrawTx = await txdb.findOne({tx_id: txID})
      const fromAccount = await accountdb.findOne({index: withdrawTx["from_index"]})
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
      const position = blockInputJson.paths2txRootPos[blockIndex]
      const proof = blockInputJson.paths2txRoot[blockIndex]

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
      const withdrawProofResult  = await proveWithdrawSignature(
        withdrawTx["senderPubkey"],
        withdrawTx["withdraw_r8x"],
        withdrawTx["withdraw_r8x"],
        withdrawTx["withdraw_s"],
        withdrawTx["withdraw_msg"]
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
        return res.json(util.Succ({addResult: result, currentTxID: currentTxID}))
    })

    app.get("/zkzru/tx/:txid", async (req, res) => {
      let filter = {}
      if (req.params.txid != "") {
          filter = {"txid": req.params.txid}
      }
      return res.json(util.Succ(await txdb.findAll(filter)))
    })

    app.get("/zkzru/getPendingTxsCount", async (req, res) => {
      let amount = await txdb.count({status: 0})
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
            req.body.index,
            req.body.pubkey,
            req.body.address,
            req.body.tokenType,
            req.body.balance,
            req.body.nonce,
            req.body.prvkey
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
      let mimcjs = await buildMimc7();
      let F = mimcjs.F;
      const records = await depositSubTreeRootdb.findAll({})
      
      let leafNodes = new Array(records.length)
      for (var i = 0; i < records.length; i++){
        const subTreeRoot = records[i]["subTreeRoot"]
        leafNodes[i] = F.e(subTreeRoot)
      }

      const padValue = zeroCache[subtreeDepth]

      const paddedLeafNodes = treeHelper.padArray(
        leafNodes, padValue, 2 ** (ACC_DEPTH - subtreeDepth)
      )
      
      let merkleTree = new Tree(paddedLeafNodes)
      const idx = records.length
      const {proof, proofPos} = merkleTree.getProof(idx)

      console.log("proof:", proof)
      console.log("proofPos", proofPos)

      return res.json(util.Succ({proof, proofPos}))
  })
}
