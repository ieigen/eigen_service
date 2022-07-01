const axios = require("axios")
const ethers = require("ethers")
const { setIntervalAsync } = require('set-interval-async/dynamic')
const RollupNC = require("../utils/RollupNC.json")
const util = require("../src/util")

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
};

util.require_env_variables(["COORDINATOR_PRIVATE_KEY", "ROLLUPNC_CONTRACT_ADDRESS", "NETWORK_ID"])
const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY
const contractAddress = process.env.ROLLUPNC_CONTRACT_ADDRESS
const network_id = process.env.NETWORK_ID

const provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')

const queryAndProve = async () => {
    let amount
    await axios.get('http://localhost:3000/zkzru/getPendingTxsCount')
        .then(function (response) {
            console.log(response);
            amount = response.data.amount
            console.log("Current pending tx amount is:", amount)
        })
        .catch(function (error) {
            console.log(error);
        });
    if (amount >= 4) {
        console.log("======================Start to prove=======================")
        await axios.post('http://localhost:3000/zkzru/prove', {
          network_id: network_id,
        }, axiosConfig)
            .then(function (response) {
            console.log("Generate block %d successfully!", response.data.blockNumber);
        })
            .catch(function (error) {
            console.log(error);
        });
        console.log("========================Prove ends==========================")
    }
}

const processDeposit = async () => {
  let queueNumber
  let wallet = new ethers.Wallet(coordinatorPrivateKey, provider);
  let rollupNC = new ethers.Contract(contractAddress, RollupNC.abi, wallet)
  queueNumber = await rollupNC.queueNumber();
  let currentSubTreeRoot;

  let proof;
  let proofPos;
  if (queueNumber == 4) {
      await axios.get('http://localhost:3000/zkzru/getProcessDepositProof', {
      }, axiosConfig)
      .then(function (response) {
          console.log("Get ProcessDeposit Info successfully!");
          proof = response.data.proof;
          console.log("The proof is:", proof)
          proofPos = response.data.proofPos;
          console.log("The proofPos is:", proofPos)
      })
      .catch(function (error) {
          console.log(error);
      });

      // look test in ZKZRU, the currentSubTreeRoot is the first4Hash, second4Hash...
      currentSubTreeRoot = await rollupNC.pendingDeposits(0)

      // Call RollupNC contract processDeposit method
      let processDepositResult = await rollupNC.processDeposit(
        2,
        proofPos,
        proof
      );
      console.log("ProcessDeposit Result:", processDepositResult)

      // add currentSubTreeRoot in db
      await axios.post('http://localhost:3000/zkzru/depositSubTreeRoot', {
        subTreeRoot: currentSubTreeRoot
    }, axiosConfig)
        .then(function (response) {
        console.log("add subTreeRoot successfully!")
        console.log(response);
    })
        .catch(function (error) {
        console.log("add subTreeRoot error!")
        console.log(error);
    });
  }
}

function main() {
    setInterval(async () => {
        await processDeposit();     
      }, 60 * 1000
    )

    // query every minute
    setInterval(async () => {
        await queryAndProve();     
      }, 60 * 1000
    )
}

main()