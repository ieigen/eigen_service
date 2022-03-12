// relay.ts
/**
 * Provides encryption and decryption services
 *
 * @module relay
 */

import consola from "consola";

import * as util from "../util";

import * as userdb from "../model/database_id";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const relay_sdk = require("relay_sdk");
const relayutil = relay_sdk.util;
const relaysdk = relay_sdk.sdk;

relayutil.require_env_variables([
  "TEESDK_AUDITOR_BASE_DIR",
  "TEESDK_AUDITOR_NAME",
  "TEESDK_ENCLAVE_INFO_PATH",
  "RELAY_ADDRESS",
  "RELAY_PORT",
]);

const AUDITOR_BASE_DIR = process.env.TEESDK_AUDITOR_BASE_DIR;
// auditor_name, e.g., "godzilla"
const AUDITOR_NAME = process.env.TEESDK_AUDITOR_NAME;
const ENCLAVE_INFO_PATH = process.env.TEESDK_ENCLAVE_INFO_PATH;
const PUB = `${AUDITOR_BASE_DIR}/${AUDITOR_NAME}/${AUDITOR_NAME}.public.der`;
const SIG = `${AUDITOR_BASE_DIR}/${AUDITOR_NAME}/${AUDITOR_NAME}.sign.sha256`;
const ROOTCA = `deps/ias_root_ca_cert.pem`;

module.exports = function (app) {
  app.post("/kms/:user_id/enc", async (req, res) => {
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
    const cc1 = req.body.cc1; // encrypted password by relay public key
    const hash = req.body.hash; // the hash of password, currently SHA256
    if (c1 == undefined || cc1 == undefined || hash == undefined) {
      res.json(
        util.Err(
          util.ErrCode.InvalidInput,
          "Invalid parameters: c1, cc1, hash should all be given"
        )
      );
      return;
    }

    consola.info("Hash = ", hash);

    // check if password_hash is equal
    const user = await userdb.findByID(user_id);

    consola.info(`User with ${user_id}: ${JSON.stringify(user)}`);

    if (
      user["dataValues"]["password_hash"] !== "" &&
      hash !== user["dataValues"]["password_hash"]
    ) {
      consola.error(
        "Hash not equal: ",
        user["dataValues"]["password_hash"],
        hash
      );
      res.json(
        util.Err(
          util.ErrCode.NotTheOnlyPassword,
          "Only one password can be given for an account"
        )
      );
      return;
    }

    // encrypt by kms
    const encryptMsg = `encrypt|${c1}|${cc1}|`;
    consola.log(encryptMsg);
    const client = new relaysdk.EigenRelayClient(
      "fns",
      PUB,
      SIG,
      ROOTCA,
      ENCLAVE_INFO_PATH,
      process.env.RELAY_ADDRESS,
      Number(process.env.RELAY_PORT)
    );
    try {
      client.submit_task("relay", encryptMsg, async (c2) => {
        // consola.log(c2)
        res.json(util.Succ(c2));
      });
      consola.success("Update hash with: ", hash);
      userdb.updatePasswordHash(user_id, hash);
    } catch (e) {
      res.json(util.Err(util.ErrCode.CryptoError, "Invalid encryption"));
    }
  });

  app.post("/kms/:user_id/dec", async (req, res) => {
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
    const c1 = req.body.c1; // encrypted password by relay public key
    const cc2 = req.body.cc2; // encrypted private key by kms
    if (c1 == undefined || cr1 == undefined || cc2 == undefined) {
      res.json(util.Err(util.ErrCode.InvalidInput, "Invalid parameters"));
      return;
    }

    // decrypt by kms
    const encryptMsg = `decrypt|${cc2}|${c1}|${cr1}`;
    consola.log(encryptMsg);

    const client = new relaysdk.EigenRelayClient(
      "fns",
      PUB,
      SIG,
      ROOTCA,
      ENCLAVE_INFO_PATH,
      process.env.RELAY_ADDRESS,
      Number(process.env.RELAY_PORT)
    );
    try {
      client.submit_task("relay", encryptMsg, async (decryptedPrivateKey) => {
        //const privateKey2 = ecies.aes_dec('aes-256-gcm', aesKey, Buffer.from(decryptedPrivateKey, "base64"))
        //chai.expect(privateKey).to.eq(privateKey2)
        res.json(util.Succ(decryptedPrivateKey));
      });
    } catch (e) {
      res.json(util.Err(util.ErrCode.CryptoError, "Invalid decryption"));
    }
  });
};
