import { ethers } from "ethers";

import * as util from "../util";
require("dotenv").config();

util.require_env_variables(["INFURA_PROJECT_ID"]);

export const ROPSTEN = "ropsten";
export const RINKEBY = "rinkeby";
export const KOVAN = "kovan";
export const MAINNET = "mainnet";
export const GOERLI = "goerli";
export const NETWORK_TYPE_RPC = "rpc";

export const MAINNET_NETWORK_ID = "1";
export const ROPSTEN_NETWORK_ID = "3";
export const RINKEBY_NETWORK_ID = "4";
export const GOERLI_NETWORK_ID = "5";
export const KOVAN_NETWORK_ID = "42";
export const LOCALHOST_NETWORK_ID = "1337";

export const MAINNET_CHAIN_ID = "0x1";
export const ROPSTEN_CHAIN_ID = "0x3";
export const RINKEBY_CHAIN_ID = "0x4";
export const GOERLI_CHAIN_ID = "0x5";
export const KOVAN_CHAIN_ID = "0x2a";
export const LOCALHOST_CHAIN_ID = "0x539";
export const BSC_CHAIN_ID = "0x38";
export const OPTIMISM_CHAIN_ID = "0xa";
export const OPTIMISM_TESTNET_CHAIN_ID = "0x45";
export const POLYGON_CHAIN_ID = "0x89";

export const MAX_SAFE_CHAIN_ID = 4503599627370476;

export const ROPSTEN_DISPLAY_NAME = "Ropsten";
export const RINKEBY_DISPLAY_NAME = "Rinkeby";
export const KOVAN_DISPLAY_NAME = "Kovan";
export const MAINNET_DISPLAY_NAME = "Ethereum Mainnet";
export const GOERLI_DISPLAY_NAME = "Goerli";

const infuraProjectId = process.env.INFURA_PROJECT_ID;
const getRpcUrl = (network) =>
  `https://${network}.infura.io/v3/${infuraProjectId}`;

export const ROPSTEN_RPC_URL = getRpcUrl("ropsten");
export const RINKEBY_RPC_URL = getRpcUrl("rinkeby");
export const KOVAN_RPC_URL = getRpcUrl("kovan");
export const MAINNET_RPC_URL = getRpcUrl("mainnet");
export const GOERLI_RPC_URL = getRpcUrl("goerli");

export const ETH_SYMBOL = "ETH";
export const WETH_SYMBOL = "WETH";
export const TEST_ETH_SYMBOL = "TESTETH";
export const BNB_SYMBOL = "BNB";
export const MATIC_SYMBOL = "MATIC";

export const ETH_TOKEN_IMAGE_URL = "./images/eth_logo.svg";
export const TEST_ETH_TOKEN_IMAGE_URL = "./images/black-eth-logo.svg";
export const BNB_TOKEN_IMAGE_URL = "./images/bnb.png";
export const MATIC_TOKEN_IMAGE_URL = "./images/matic-token.png";

export const INFURA_PROVIDER_TYPES = [ROPSTEN, RINKEBY, KOVAN, MAINNET, GOERLI];

export const TEST_CHAINS = [
  ROPSTEN_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  GOERLI_CHAIN_ID,
  KOVAN_CHAIN_ID,
];

/**
 * Map of all build-in Infura networks to their network and chain IDs.
 */
export const NETWORK_TYPE_TO_ID_MAP = {
  [ROPSTEN]: { networkId: ROPSTEN_NETWORK_ID, chainId: ROPSTEN_CHAIN_ID },
  [RINKEBY]: { networkId: RINKEBY_NETWORK_ID, chainId: RINKEBY_CHAIN_ID },
  [KOVAN]: { networkId: KOVAN_NETWORK_ID, chainId: KOVAN_CHAIN_ID },
  [GOERLI]: { networkId: GOERLI_NETWORK_ID, chainId: GOERLI_CHAIN_ID },
  [MAINNET]: { networkId: MAINNET_NETWORK_ID, chainId: MAINNET_CHAIN_ID },
};

import fs from "fs";
var mainnet_tokens = JSON.parse(
  fs.readFileSync("./token_directory/mainnet_erc20.json", "utf-8")
);

export const NETWORK_TYPE_TO_TOKENS = {
  [ROPSTEN]: [],
  [RINKEBY]: [],
  [KOVAN]: [],
  [GOERLI]: [],
  [MAINNET]: mainnet_tokens.tokens,
};

const UNISWAP_V3_ADDRESSES = {
  UniswapV3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  Multicall2: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  ProxyAdmin: "0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2",
  TickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
  Quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  NFTDescriptor: "0x42B24A95702b9986e82d421cC3568932790A48Ec",
  NonfungibleTokenPositionDescriptor:
    "0x91ae842A5Ffd8d12023116943e72A606179294f3",
  TransparentUpgradeableProxy: "0xEe6A57eC80ea46401049E92587E52f5Ec1c24785",
  NonfungiblePositionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  V3Migrator: "0xA5644E29708357803b5A882D272c41cC0dF92B34",
};

export const NETWORK_TYPE_TO_UNISWAP_V3 = {
  [ROPSTEN]: UNISWAP_V3_ADDRESSES,
  [RINKEBY]: UNISWAP_V3_ADDRESSES,
  [KOVAN]: UNISWAP_V3_ADDRESSES,
  [GOERLI]: UNISWAP_V3_ADDRESSES,
  [MAINNET]: UNISWAP_V3_ADDRESSES,
};

const UNISWAP_V2_ADDRESSES = {
  Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  Router01: "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a",
  Router02: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
};

export const NETWORK_TYPE_TO_UNISWAP_V2 = {
  [ROPSTEN]: UNISWAP_V2_ADDRESSES,
  [RINKEBY]: UNISWAP_V2_ADDRESSES,
  [KOVAN]: UNISWAP_V2_ADDRESSES,
  [GOERLI]: UNISWAP_V2_ADDRESSES,
  [MAINNET]: UNISWAP_V2_ADDRESSES,
};

export const NETWORK_TO_NAME_MAP = {
  [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY]: RINKEBY_DISPLAY_NAME,
  [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [GOERLI]: GOERLI_DISPLAY_NAME,

  [ROPSTEN_NETWORK_ID]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY_NETWORK_ID]: RINKEBY_DISPLAY_NAME,
  [KOVAN_NETWORK_ID]: KOVAN_DISPLAY_NAME,
  [GOERLI_NETWORK_ID]: GOERLI_DISPLAY_NAME,
  [MAINNET_NETWORK_ID]: MAINNET_DISPLAY_NAME,

  [ROPSTEN_CHAIN_ID]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY_CHAIN_ID]: RINKEBY_DISPLAY_NAME,
  [KOVAN_CHAIN_ID]: KOVAN_DISPLAY_NAME,
  [GOERLI_CHAIN_ID]: GOERLI_DISPLAY_NAME,
  [MAINNET_CHAIN_ID]: MAINNET_DISPLAY_NAME,
};

export const CHAIN_ID_TO_TYPE_MAP = Object.entries(
  NETWORK_TYPE_TO_ID_MAP
).reduce((chainIdToTypeMap, [networkType, { chainId }]) => {
  chainIdToTypeMap[chainId] = networkType;
  return chainIdToTypeMap;
}, {});

export const CHAIN_ID_TO_RPC_URL_MAP = {
  [ROPSTEN_CHAIN_ID]: ROPSTEN_RPC_URL,
  [RINKEBY_CHAIN_ID]: RINKEBY_RPC_URL,
  [KOVAN_CHAIN_ID]: KOVAN_RPC_URL,
  [GOERLI_CHAIN_ID]: GOERLI_RPC_URL,
  [MAINNET_CHAIN_ID]: MAINNET_RPC_URL,
};

export const CHAIN_ID_TO_NETWORK_ID_MAP = Object.values(
  NETWORK_TYPE_TO_ID_MAP
).reduce((chainIdToNetworkIdMap, { chainId, networkId }) => {
  chainIdToNetworkIdMap[chainId] = networkId;
  return chainIdToNetworkIdMap;
}, {});

export const NATIVE_CURRENCY_TOKEN_IMAGE_MAP = {
  [ETH_SYMBOL]: ETH_TOKEN_IMAGE_URL,
  [TEST_ETH_SYMBOL]: TEST_ETH_TOKEN_IMAGE_URL,
  [BNB_SYMBOL]: BNB_TOKEN_IMAGE_URL,
  [MATIC_SYMBOL]: MATIC_TOKEN_IMAGE_URL,
};

// A Human-Readable ABI; for interacting with the contract, we
// must include any fragment we wish to use
const ERC20_ABI = [
  // Read-Only Functions
  "function allowance(address tokenOwner, address spender) public view returns (uint remaining)",
];

import { Sequelize, Op, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_token_allowance.sqlite",
});

const token_allowance_db = sequelize.define("token_allowance_st", {
  network: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  token_address: {
    type: DataTypes.STRING(64),
    allowNull: false,
    primaryKey: true,
  },
  allowance: DataTypes.INTEGER,
});

sequelize
  .sync()
  .then(function () {
    return token_allowance_db.create({
      network: "_network",
      token_address: "0xTOKEN",
      allowance: 0,
    });
  })
  .then(function (row: any) {
    console.log(
      row.get({
        plain: true,
      })
    );
    token_allowance_db.destroy({
      where: { network: row.network, token_address: row.token_address },
    });
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

const add = function (dict) {
  return token_allowance_db.create({
    network: dict.network,
    token_address: dict.token_address,
    allowance: dict.allowance,
  });
};

const get = function (network, token_address) {
  return token_allowance_db.findOne({ where: { network, token_address } });
};

export const get_allowance = function (
  network,
  user_address,
  token_address,
  swap_address
) {
  let provider = ethers.getDefaultProvider(getRpcUrl(network));
  console.log("Provider: ", provider);

  const token = new ethers.Contract(token_address, ERC20_ABI, provider);
  console.log("erc20: ", token);

  token.allowance(user_address, swap_address).then(function (res) {
    console.log(res);
    return res;
  });
};
