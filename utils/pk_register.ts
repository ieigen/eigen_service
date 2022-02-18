const axios = require("axios");
import querystring from "querystring";
const consola = require("consola");

const relay_sdk = require("relay_sdk");
let relayutil = relay_sdk.util;
let relaysdk = relay_sdk.sdk;

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

const main = () => {
  const client = new relaysdk.EigenRelayClient(
    "fns",
    PUB,
    SIG,
    ROOTCA,
    ENCLAVE_INFO_PATH,
    process.env.RELAY_ADDRESS,
    Number(process.env.RELAY_PORT)
  );

  consola.log("Client created: ", client);

  try {
    consola.log("Going to submit task");
    client.submit_task("EigenTEERegister", "", (public_key) => {
      if (public_key.length === 0) {
        throw new Error("Get public key failed");
      }

      consola.log("Get public key from fns: ", public_key);

      axios
        .post(
          `http://eigen_service:3000/store`,
          {
            digest: "1",
            public_key: public_key,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (res) {
          consola.log("Success post, and return: ", res.data);
          process.exit(0);
        })
        .catch((error) => {
          console.error(`Failed to post public key`, error);
          throw new Error(error.message);
        });
    });
  } catch (e) {
    consola.log("Fail to submit task: ", e);
  }

  consola.log("OK");
};

main();
