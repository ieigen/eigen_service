const axios = require("axios")
const ethers = require("ethers")
const { setIntervalAsync } = require('set-interval-async/dynamic')
const RollupNC = require("../utils/RollupNC.json")
require('dotenv').config()
// const util = require("../src/util")

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
};

// util.require_env_variables(["COORDINATOR_PRIVATE_KEY", "ROLLUPNC_CONTRACT_ADDRESS", "NETWORK_ID"])
const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY || process.exit(-1)
const coordinatorPublicKey = process.env.COORDINATOR_PUBLIC_KEY || process.exit(-1)
const coordinatorAddress = process.env.COORDINATOR_ADDRESS || process.exit(-1)
const contractAddress = process.env.ROLLUPNC_CONTRACT_ADDRESS || process.exit(-1)
const network_id = process.env.NETWORK_ID || process.exit(-1)

const provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')

const queryAndProve = async () => {
    let amount
    await axios.get('http://localhost:3000/zkzru/getPendingTxsCount')
        .then(function (response) {
            console.log(response);
            amount = response.data.data.count
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
            console.log("Generate block %d successfully!", response.data.data.blockNumber);
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
  let res = await rollupNC.queueNumber();
  queueNumber = res.toNumber();
  console.log("Current queue number is:", queueNumber);
  let currentSubTreeRoot;

  let proof;
  let proofPos;
  if (queueNumber == 4) {
      await axios.get('http://localhost:3000/zkzru/getProcessDepositProof', {
      }, axiosConfig)
      .then(function (response) {
	        console.log(response)
          console.log("Get ProcessDeposit Info successfully!");
          proof = response.data.data.proof;
          console.log("The proof is:", proof)
          proofPos = response.data.data.proofPos;
          console.log("The proofPos is:", proofPos)
      })
      .catch(function (error) {
          console.log(error);
      });

      // look test in ZKZRU, the currentSubTreeRoot is the first4Hash, second4Hash...
      let pendingDeposits0 = await rollupNC.pendingDeposits(0)
      currentSubTreeRoot = pendingDeposits0.toString() 
      console.log("currentSubTreeRoot is:", currentSubTreeRoot)

      // Call RollupNC contract processDeposit method
      let processDepositResult = await rollupNC.processDeposits(
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

const initAccount = async () => {
    let proof;
    let proofPos;
    let wallet = new ethers.Wallet(coordinatorPrivateKey, provider);
    let rollupNC = new ethers.Contract(contractAddress, RollupNC.abi, wallet)

    // Zero Account: deposit -> processDeposit -> create zeroAccount in DB
    // deposit
    rollupNC.deposit([0, 0], 0, 0).then(async tx=> {
      console.log(tx)
      tx.wait().then(async res => {
        console.log('deposit zero account:', res)
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
    })

    await axios.get('http://localhost:3000/zkzru/getProcessDepositData', {
      }, axiosConfig)
      .then(function (response) {
	        console.log(response)
          console.log("Get ProcessDeposit Info successfully!");
          proof = response.data.data.proof;
          console.log("The proof is:", proof)
          proofPos = response.data.data.proofPos;
          console.log("The proofPos is:", proofPos)
      })
      .catch(function (error) {
          console.log(error);
      });

    // Call RollupNC contract processDeposit method
    rollupNC.processDeposits(proofPos, proof).then(async tx=> {
      console.log(tx)
      tx.wait().then(async res => {
          console.log('processDeposit zero account:', res)
      }).catch(error => {
          console.log(error)
      })
    }).catch(error => {
        console.log(error)
    })

    // create zeroAccount in DB
    let url= "http://localhost:3000/zkzru/account/0"
    let res = await axios.get(url, {
      }, axiosConfig)
    if (res.data.data.length == 0) {
        const req = {
            account_index: 0,
            network_id: network_id,
            pubkey: "0",
            address: "0",
            tokenType: 0,
            balance: "0",
            nonce: 0, // currently nonce must be 0
            virtual_nonce: 0
        }
        await axios.post('http://localhost:3000/zkzru/account', req, axiosConfig)
    }


    // Coordinator Account: deposit -> processDeposit -> create coordinator Account in DB
    const pubkeyCoordinator = [
      '11272163730179884137553846264063981893256467337839744581177763041069534786542',
      '15087857856636020541068595983556500961641122088946557767189421497078430055442'
    ]
    // deposit
    rollupNC.deposit(pubkeyCoordinator, 0, 0).then(async tx=> {
      console.log(tx)
      tx.wait().then(async res => {
        console.log('deposit zero account:', res)
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
    })

    await axios.get('http://localhost:3000/zkzru/getProcessDepositData', {
      }, axiosConfig)
      .then(function (response) {
	        console.log(response)
          console.log("Get ProcessDeposit Info successfully!");
          proof = response.data.data.proof;
          console.log("The proof is:", proof)
          proofPos = response.data.data.proofPos;
          console.log("The proofPos is:", proofPos)
      })
      .catch(function (error) {
          console.log(error);
      });


    rollupNC.processDeposits(proofPos, proof).then(async tx=> {
      console.log(tx)
      tx.wait().then(async res => {
          console.log('processDeposit zero account:', res)
      }).catch(error => {
          console.log(error)
      })
    }).catch(error => {
        console.log(error)
    })

    // create coordinator account in DB
    url= "http://localhost:3000/zkzru/account/" + coordinatorAddress
    res= await axios.get(url, {
      }, axiosConfig)
    if (res.data.data.length == 0) {
        const req2 = {
            network_id: network_id,
            pubkey: coordinatorPublicKey,
            address: coordinatorAddress,
            tokenType: 0,
            balance: "0",
            nonce: 0, // currently nonce must be 0
            virtual_nonce: 0
        }
        await axios.post('http://localhost:3000/zkzru/account', req2, axiosConfig)
    }
}

function main() {
    initAccount()

    // query every minute
    setInterval(async () => {
        await queryAndProve();     
      }, 120 * 1000
    )
}

main()
