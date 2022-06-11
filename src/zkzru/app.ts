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

// import prover
import * as prover from "@ieigen/zkzru";


// prove, tx submit and query
module.exports = function (app) {

    app.post("/zkzru/prove", async (req, res) => {
        let accArray = await accountdb.findAll({})
        let txArray = await txdb.findAll({})

        const result = await prover.prove(accArray, txArray)

        // TODO
    })

    app.post("/zkzru/tx", async(req, res) => {
        const result = await txdb.add(
            req.body.network_id,
            req.body.senderPubkey,
            req.body.receiverPubkey,
            req.body.index,
            req.body.amount,
            req.body.nonce,
            req.body.tokenTypeFrom,
            req.body.txRoot,
            req.body.position,
            req.body.proof
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
            res.body.network_id,
            res.body.index,
            res.body.pubkey,
            res.body.tokenType,
            res.body.balance,
            res.body.nonce
        )
        return res.json(util.Succ(result))
    })
}
