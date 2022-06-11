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
import * as prover from "@ieigen/zkzru";

const TX_LEAVES = 2

const padding = (arr, num) => {

    if (arr.length >= num) {
        return arr.slice(0, num)
    }

    const padNum = num - arr.length;
    for (const i = 0; i < padNum; i ++) {
        arr.push(txdb.emptyTX())
    }
    return arr
}

// prove, tx submit and query
module.exports = function (app) {

    app.post("/zkzru/prove", async (req, res) => {
        const network_id = req.body.network_id;
        let accArray = await accountdb.findAll({status: 0})
        const txArray = await txdb.findAll({})

        // 1. get TX_LEAVES transactions from accArray
        accArray = padding(accArray, TX_LEAVES)

        // 2. generate proof, returns inputJson, proof
        const result = await prover.prove(accArray, txArray)

        // 3. add new block
        let blockNumber = await blockdb.nextBlockNumber()

        blockdb.add(network_id, blockNumber, result["inputJson"], result["publicJson"], result["proofJson"])

        // 4. update status
        let updatedIndex = accArray.map(function(item){return item["index"]})
        txdb.update(updatedIndex, {"status": 1})
    })

    // insert new transaction into database
    app.post("/zkzru/tx", async(req, res) => {
        const result = await txdb.add(
            req.body.network_id,
            req.body.senderPubkey,
            req.body.receiverPubkey,
            req.body.index,
            req.body.amount,
            req.body.nonce,
            req.body.tokenTypeFrom
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

    app.get("/zKzru/tx/:txid", async (req, res) => {
        let filter = {}
        if (req.params.txid != "") {
            filter = {"txid": req.params.txid}
        }
        return res.json(util.Succ(await txdb.findAll(filter)))
    })

    app.post("/zkzru/account", async (req, res) => {
        const result = await accountdb.add(
            res.body.network_id,
            res.body.index,
            res.body.pubkey,
            res.body.tokenType,
            res.body.balance,
            res.body.nonce
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
