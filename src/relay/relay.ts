import express from "express";
import * as util from "../util";
import * as keydb from "../model/database_key";
import * as ecies from "../crypto/ecies";
import * as elliptic from "elliptic"
const EC = elliptic.ec;
const ec = new EC("p256");

// FOR DEBUG
const debug_pub = "04a52438a5c1bba393d167994974b6d299bbdb078263144c9d9429bb65bb151fa3718657caea7bb5adef04a8cf8d40ff20bbc3a9330f04c2acb5b209cd25a2d863";
const debug_priv = "404a7d7eb5f367ba756dfd1c4f3b14fad4b1000a7cbac2497edac02eb078aab9"
const PUBK = process.env.PUBK || debug_pub
const PRIK = process.env.PRIK || debug_priv

module.exports = function(app) {
    app.post("/relay/:user_id/upload", async(req, res) => {
        const user_id = req.params.user_id;
        if (!util.check_user_id(req, user_id)) {
            res.json(
                util.Err(
                    util.ErrCode.InvalidAuth,
                    "user_id does not match, you can't see any other people's information"
                )
            );
            return;
        }
        let ret = await keydb.add(user_id, req.body.address, req.body.cipher_key)
        res.json(util.Succ(ret));
    })

    app.post("/relay/:user_id/download", async(req, res) => {
        const user_id = req.params.user_id;
        if (!util.check_user_id(req, user_id)) {
            res.json(
                util.Err(
                    util.ErrCode.InvalidAuth,
                    "user_id does not match, you can't see any other people's information"
                )
            );
            return;
        }
        let ret = await keydb.getByUserID(user_id)
        res.json(util.Succ(ret));
    })

    // FOR DEBUG, never use on production
    app.post("/kms/:user_id/enc", async(req, res) => {
        const user_id = req.params.user_id;
        if (!util.check_user_id(req, user_id)) {
            res.json(
                util.Err(
                    util.ErrCode.InvalidAuth,
                    "user_id does not match, you can't see any other people's information"
                )
            );
            return;
        }
        const keyPair = ec.keyFromPublic(PUBK, "hex");
        const publicKey = keyPair.getPublic();

        const options = {
            hashName: 'sha512',
            hashLength: 64,
            macName: 'sha256',
            macLength: 32,
            curveName: 'prime256v1',
            symmetricCypherName: 'aes-256-gcm',
            keyFormat: 'uncompressed',
            s1: null, // optional shared information1
            s2: null // optional shared information2
        }
        console.log(req.body)
        let ret = ecies.encrypt(publicKey, req.body.plain_key, options)
        res.json(util.Succ(ret.toString("hex")));
    })

    // FOR DEBUG, never use on production
    app.post("/kms/:user_id/dec", async(req, res) => {
        const user_id = req.params.user_id;
        if (!util.check_user_id(req, user_id)) {
            res.json(
                util.Err(
                    util.ErrCode.InvalidAuth,
                    "user_id does not match, you can't see any other people's information"
                )
            );
            return;
        }
        const options = {
            hashName: 'sha512',
            hashLength: 64,
            macName: 'sha256',
            macLength: 32,
            curveName: 'prime256v1',
            symmetricCypherName: 'aes-256-gcm',
            keyFormat: 'uncompressed',
            s1: null, // optional shared information1
            s2: null // optional shared information2
        }
        console.log(req.body)
        const keyPair = ec.keyFromPrivate(PRIK, "hex");
        let cipher_key = Buffer.from(req.body.cipher_key, "hex");
        let ret = ecies.decrypt(keyPair, cipher_key, options)
        res.json(util.Succ(ret));
    })

}
