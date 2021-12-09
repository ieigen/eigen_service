import * as util from "../util";
require("dotenv").config();

util.require_env_variables(["INFURA_PROJECT_ID"]);

const infuraProjectId = process.env.INFURA_PROJECT_ID;

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
export const LOCALHOST_NETWRK_ID = "1337";

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

export const getRpcUrl = (network) =>
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
export const MAINNET_TOKENS = JSON.parse(
  fs.readFileSync("./token_directory/mainnet_erc20.json", "utf-8")
);

export const MAINNET_TOKEN_ADDRESS_TO_TOKEN_MAP = Object.values(
  MAINNET_TOKENS.tokens
).reduce(
  (
    tokenMap,
    { chainId, address, name, symbol, decimals, logoURI, extensions }
  ) => {
    tokenMap[address] = {
      chainId,
      address,
      name,
      symbol,
      decimals,
      logoURI,
      extensions,
    };

    return tokenMap;
  },
  {}
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

export const UNISWAP_V2_ADDRESSES = {
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

export const ERC20_ALLOWANCE_ABI = [
  // Read-Only Functions
  "function allowance(address tokenOwner, address spender) public view returns (uint remaining)",
];
