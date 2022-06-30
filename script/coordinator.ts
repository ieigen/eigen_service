const axios = require("axios")
const ethers = require("ethers")
const { setIntervalAsync } = require('set-interval-async/dynamic')
const RollupNC = require("../utils/RollupNC.json")

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
};

// FIXME: set network_id constant currently
const network_id = 1;
let contractAddress = "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E";
// TODO: change the proverPrivateKey
const coordinatorPrivateKey = "0x111"
const provider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')

const queryAndProve = async () => {
    let amount
    await axios.get('http://localhost:3000/zkzru/getPendingTxsCount')
        .then(function (response) {
            console.log(response);
            amount = response.data.amount
        })
        .catch(function (error) {
            console.log(error);
        });
    if (amount >= 4) {
        await axios.post('http://localhost:3000/zkzru/prove', {
          network_id: network_id,
        }, axiosConfig)
            .then(function (response) {
            console.log("Generate block %d successfully!", response.data.blockNumber);
        })
            .catch(function (error) {
            console.log(error);
        });
    }
}

const processDeposit = async () => {
  let queueNumber
  let wallet = new ethers.Wallet(coordinatorPrivateKey, provider);
  let rollupNC = new ethers.Contract(contractAddress, RollupNC.abi, wallet)
  queueNumber = await rollupNC.queueNumber();

  let proof;
  let proofPos;
  if (queueNumber >= 4) {
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

      // TODO: add depositSubTreeRoot to db
      
      // Call RollupNC contract processDeposit method
      let processDepositResult = await rollupNC.processDeposit(
        2,
        proofPos,
        proof
      );
      console.log("ProcessDeposit Result:", processDepositResult)
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