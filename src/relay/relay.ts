import express from "express";
import * as util from "../util";
import * as ecies from "../crypto/ecies";
import * as elliptic from "elliptic"
const EC = elliptic.ec;
const ec = new EC("p256");

import * as relaysdk from "relay_sdk";

relaysdk.require_env_variables([
  "TEESDK_AUDITOR_BASE_DIR",
  "TEESDK_AUDITOR_NAME",
  "TEESDK_ENCLAVE_INFO_PATH",
  "RELAY_ADDRESS",
  "RELAY_PORT"
]);

const AUDITOR_BASE_DIR = process.env.TEESDK_AUDITOR_BASE_DIR;
// auditor_name, e.g., "godzilla"
const AUDITOR_NAME = process.env.TEESDK_AUDITOR_NAME;
const ENCLAVE_INFO_PATH = process.env.TEESDK_ENCLAVE_INFO_PATH;
const PUB = `${AUDITOR_BASE_DIR}/${AUDITOR_NAME}/${AUDITOR_NAME}.public.der`;
const SIG = `${AUDITOR_BASE_DIR}/${AUDITOR_NAME}/${AUDITOR_NAME}.sign.sha256`;
const ROOTCA = `deps/ias_root_ca_cert.pem`;

module.exports = function(app) {

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

        const c1 = req.body.c1; //  encrypted private key by relay public key
        const cc1 = req.body.c1; // encrypted password by relay public key

        // encrypt by kms
        let encryptMsg = `encrypt|${c1}|${cc1}|`
        const client = new relaysdk.EigenRelayClient(
            "fns",
            PUB,
            SIG,
            ROOTCA,
            ENCLAVE_INFO_PATH,
            process.env.RELAY_ADDRESS,
            Number(process.env.RELAY_PORT)
        );
        client.submit_task("relay", encryptMsg, async (c2) => {
            // console.log(c2)
            res.json(util.Succ(c2));
        })
    })

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

        const cr1 = req.body.cr1; // encrypted aes secret by relay public key
        const cc1 = req.body.c1; // encrypted password by relay public key
        const cc2 = req.body.cc2; // encrypted private key by kms

        // decrypt by kms
        let encryptMsg = `decrypt|${cc2}|${cc1}|${cr1}`

        const client = new relaysdk.EigenRelayClient(
            "fns",
            PUB,
            SIG,
            ROOTCA,
            ENCLAVE_INFO_PATH,
            process.env.RELAY_ADDRESS,
            Number(process.env.RELAY_PORT)
        );
        client.submit_task("relay", encryptMsg, async (decryptedPrivateKey) => {
            //const privateKey2 = ecies.aes_dec('aes-256-gcm', aesKey, Buffer.from(decryptedPrivateKey, "base64"))
            //chai.expect(privateKey).to.eq(privateKey2)
            res.json(util.Succ(decryptedPrivateKey));
        })
        //res.json(util.Succ(ret.toString("hex")));
    })

}
