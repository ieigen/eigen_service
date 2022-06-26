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
import * as depositdb from "../model/zkzru_deposit";

import {parseDBData, prove, verify} from "@ieigen/zkzru/operator/prover"

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

// prove, tx submit and query
module.exports = function (app) {

    app.post("/zkzru/prove", async (req, res) => {
        // 1. get accounts and txs from db
        const network_id = req.body.network_id;
        const accountsInDB = await accountdb.findAll({})
        const txsInDB = await txdb.findAll({status: 0})

        // 2. generate proof, returns inputJson, proof
        const {accArray, txArray} = await parseDBData(accountsInDB, txsInDB)

        const result = await prove(accArray, txArray)

        let inputJson;
        let publicJson;
        let proofJson;
         
        try {
          const data1 = readFileSync(result["inputJson"], 'utf8');
          inputJson = data1.toString()
        
          const data2 = readFileSync(result["publicJson"], 'utf8');
          publicJson = data2.toString()

          const data3 = readFileSync(result["proofJson"], "utf-8");
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

        // 4. update status
        const updatedIndex = txsInDB.map(function(item){return item["tx_id"]})
        txdb.update({tx_id: updatedIndex}, {status: 1}).then(function (result) {
            consola.log("Update success: " + result);
          })
          .catch(function (err) {
            consola.log("Update error: " + err);
          });
        return res.json(util.Succ(""))
    })

    // insert new transaction into database
    app.post("/zkzru/tx", async(req, res) => {
        console.log(req.body)
        const result = await txdb.add(
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
            req.body.status
        )
        return res.json(util.Succ(result))
    })

    app.post("/zkzru/block", async(req, res) => {
        const result = await blockdb.add(
            req.body.network_id,
            req.body.blockNumber,
            req.body.inputJson,
            req.body.publicJson,
            req.body.proofJson
        )
        return res.json(util.Succ(result))
    })

    app.get("/zkzru/tx/:txid", async (req, res) => {
        let filter = {}
        if (req.params.txid != "") {
            filter = {"txid": req.params.txid}
        }
        return res.json(util.Succ(await txdb.findAll(filter)))
    })

    app.post("/zkzru/account", async (req, res) => {
        const result = await accountdb.add(
            req.body.network_id,
            req.body.index,
            req.body.pubkey,
            req.body.address,
            req.body.tokenType,
            req.body.balance,
            req.body.nonce,
            req.body.prvkey
        )
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

    app.post("/zkzru/deposit", async (req, res) => {
      const result = await depositdb.add(
          res.body.subTreeRoot,
      )
      return res.json(util.Succ(result))
  })

    app.get("/zkzru/getDepositProof", async (req, res) => {
      // get all deposit hash in db and construct a merkle tree
      const subtreeDepth = 2
      let mimcjs = await buildMimc7();
      let F = mimcjs.F;
      const depositInDB = await depositdb.findAll({})
      
      let leafNodes = new Array(depositInDB.length)
      for (var i = 0; i < depositInDB.length; i++){
        const subTreeRoot = depositInDB[i]["subTreeRoot"]
        leafNodes[i] = F.e(subTreeRoot)
      }

      const padValue = zeroCache[subtreeDepth]

      const paddedLeafNodes = treeHelper.padArray(
        leafNodes, padValue, 2 ** (ACC_DEPTH - subtreeDepth)
      )
      
      let merkleTree = new Tree(paddedLeafNodes)
      const idx = depositInDB.length
      const {proof, proofPos} = merkleTree.getProof(idx)

      return res.json(util.Succ({proof, proofPos}))
  })
}
