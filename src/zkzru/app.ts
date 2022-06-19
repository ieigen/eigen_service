// app.ts
/**
 * ZKZRU UI
 * @module zkzru/app
 */

import consola from "consola";
import { Op } from "sequelize";
import * as util from "../util";
import * as txdb from "../model/zkzru_tx";
import * as accountdb from "../model/zkzru_account";
import * as tokendb from "../model/zkzru_token";
import * as blockdb from "../model/zkzru_block";

// import prover
import {parseDBData, prove} from "@ieigen/zkzru/operator/prover"
//const prover = require("@ieigen/zkzru")

const ACC_DEPTH = 8
const ACC_LEAVES = 2 ** ACC_DEPTH

const padding = (arr, num) => {

    if (arr.length >= num) {
        return arr.slice(0, num)
    }

    const padNum = num - arr.length;
    for (var i = 0; i < padNum; i ++) {
        arr.push(txdb.emptyTX())
    }
    return arr
}

// prove, tx submit and query
module.exports = function (app) {

    app.post("/zkzru/prove", async (req, res) => {
        // 1. get accounts and txs from db
        const network_id = req.body.network_id;
        let accArray = await accountdb.findAll({})
        const txArray = await txdb.findAll({status: 0})

        // 2. generate proof, returns inputJson, proof
        const {acc, tx} = await parseDBData(accArray, txArray)

        const result = await prove(acc, tx)

        // 3. add new block
        let blockNumber = await blockdb.nextBlockNumber()

        blockdb.add(network_id, blockNumber, result["inputJson"], result["publicJson"], result["proofJson"])

        // 4. update status
        let updatedIndex = txArray.map(function(item){return item["tx_id"]})
        txdb.update(updatedIndex, {"status": 1})
    })

    // insert new transaction into database
    app.post("/zkzru/tx", async(req, res) => {
        console.log(req.body)
        const result = await txdb.add(
            req.body.network_id,
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
            req.body.tokenType,
            req.body.balance,
            req.body.nonce
        )
        return res.json(util.Succ(result))
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
