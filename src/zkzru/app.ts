// app.ts
/**
 * ZKZRU UI
 * @module zkzru/app
 */

import consola from "consola";
import * as util from "../util";
import * as txdb from "../model/zkzru_tx";
import * as accountdb from "../model/zkzru_account";
import * as tokendb from "../model/zkzru_token";
import * as blockdb from "../model/zkzru_block";

import {parseDBData, prove, verify} from "@ieigen/zkzru/operator/prover"

const ACC_DEPTH = 8
const ACC_LEAVES = 2 ** ACC_DEPTH

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

        const isValid = await verify(result['vk'], result['proof'])

        if (!isValid) {
            throw new Error(`Error: the generated proof is not valid`); 
        }

        // 3. add new block
        const blockNumber = await blockdb.nextBlockNumber()

        blockdb.add(network_id, blockNumber, result["inputJson"], result["publicJson"], result["proofJson"])

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
}
