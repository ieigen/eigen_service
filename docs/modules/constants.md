[](../README.md) / [Exports](../modules.md) / constants

# Module: constants

Some global constants are defined here

## Table of contents

### Variables

- [ROPSTEN](constants.md#ropsten)
- [RINKEBY](constants.md#rinkeby)
- [KOVAN](constants.md#kovan)
- [MAINNET](constants.md#mainnet)
- [GOERLI](constants.md#goerli)
- [NETWORK\_TYPE\_RPC](constants.md#network_type_rpc)
- [MAINNET\_NETWORK\_ID](constants.md#mainnet_network_id)
- [ROPSTEN\_NETWORK\_ID](constants.md#ropsten_network_id)
- [RINKEBY\_NETWORK\_ID](constants.md#rinkeby_network_id)
- [GOERLI\_NETWORK\_ID](constants.md#goerli_network_id)
- [KOVAN\_NETWORK\_ID](constants.md#kovan_network_id)
- [LOCALHOST\_NETWRK\_ID](constants.md#localhost_netwrk_id)
- [MAINNET\_CHAIN\_ID](constants.md#mainnet_chain_id)
- [ROPSTEN\_CHAIN\_ID](constants.md#ropsten_chain_id)
- [RINKEBY\_CHAIN\_ID](constants.md#rinkeby_chain_id)
- [GOERLI\_CHAIN\_ID](constants.md#goerli_chain_id)
- [KOVAN\_CHAIN\_ID](constants.md#kovan_chain_id)
- [LOCALHOST\_CHAIN\_ID](constants.md#localhost_chain_id)
- [BSC\_CHAIN\_ID](constants.md#bsc_chain_id)
- [OPTIMISM\_CHAIN\_ID](constants.md#optimism_chain_id)
- [OPTIMISM\_TESTNET\_CHAIN\_ID](constants.md#optimism_testnet_chain_id)
- [POLYGON\_CHAIN\_ID](constants.md#polygon_chain_id)
- [MAX\_SAFE\_CHAIN\_ID](constants.md#max_safe_chain_id)
- [ROPSTEN\_DISPLAY\_NAME](constants.md#ropsten_display_name)
- [RINKEBY\_DISPLAY\_NAME](constants.md#rinkeby_display_name)
- [KOVAN\_DISPLAY\_NAME](constants.md#kovan_display_name)
- [MAINNET\_DISPLAY\_NAME](constants.md#mainnet_display_name)
- [GOERLI\_DISPLAY\_NAME](constants.md#goerli_display_name)
- [ROPSTEN\_RPC\_URL](constants.md#ropsten_rpc_url)
- [RINKEBY\_RPC\_URL](constants.md#rinkeby_rpc_url)
- [KOVAN\_RPC\_URL](constants.md#kovan_rpc_url)
- [MAINNET\_RPC\_URL](constants.md#mainnet_rpc_url)
- [GOERLI\_RPC\_URL](constants.md#goerli_rpc_url)
- [ETH\_SYMBOL](constants.md#eth_symbol)
- [WETH\_SYMBOL](constants.md#weth_symbol)
- [TEST\_ETH\_SYMBOL](constants.md#test_eth_symbol)
- [BNB\_SYMBOL](constants.md#bnb_symbol)
- [MATIC\_SYMBOL](constants.md#matic_symbol)
- [INFURA\_PROVIDER\_TYPES](constants.md#infura_provider_types)
- [TEST\_CHAINS](constants.md#test_chains)
- [NETWORK\_TYPE\_TO\_ID\_MAP](constants.md#network_type_to_id_map)
- [MAINNET\_TOKENS](constants.md#mainnet_tokens)
- [MAINNET\_TOKEN\_ADDRESS\_TO\_TOKEN\_MAP](constants.md#mainnet_token_address_to_token_map)
- [NETWORK\_TYPE\_TO\_TOKENS](constants.md#network_type_to_tokens)
- [NETWORK\_TYPE\_TO\_UNISWAP\_V3](constants.md#network_type_to_uniswap_v3)
- [NETWORK\_TYPE\_TO\_UNISWAP\_V2](constants.md#network_type_to_uniswap_v2)
- [NETWORK\_TO\_NAME\_MAP](constants.md#network_to_name_map)
- [CHAIN\_ID\_TO\_TYPE\_MAP](constants.md#chain_id_to_type_map)
- [CHAIN\_ID\_TO\_RPC\_URL\_MAP](constants.md#chain_id_to_rpc_url_map)
- [CHAIN\_ID\_TO\_NETWORK\_ID\_MAP](constants.md#chain_id_to_network_id_map)
- [ERC20\_ALLOWANCE\_ABI](constants.md#erc20_allowance_abi)

### Functions

- [getRpcUrl](constants.md#getrpcurl)

## Variables

### ROPSTEN

• **ROPSTEN**: ``"ropsten"``

#### Defined in

[token/constants.ts:16](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L16)

___

### RINKEBY

• **RINKEBY**: ``"rinkeby"``

#### Defined in

[token/constants.ts:17](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L17)

___

### KOVAN

• **KOVAN**: ``"kovan"``

#### Defined in

[token/constants.ts:18](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L18)

___

### MAINNET

• **MAINNET**: ``"mainnet"``

#### Defined in

[token/constants.ts:19](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L19)

___

### GOERLI

• **GOERLI**: ``"goerli"``

#### Defined in

[token/constants.ts:20](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L20)

___

### NETWORK\_TYPE\_RPC

• **NETWORK\_TYPE\_RPC**: ``"rpc"``

#### Defined in

[token/constants.ts:21](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L21)

___

### MAINNET\_NETWORK\_ID

• **MAINNET\_NETWORK\_ID**: ``"1"``

#### Defined in

[token/constants.ts:23](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L23)

___

### ROPSTEN\_NETWORK\_ID

• **ROPSTEN\_NETWORK\_ID**: ``"3"``

#### Defined in

[token/constants.ts:24](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L24)

___

### RINKEBY\_NETWORK\_ID

• **RINKEBY\_NETWORK\_ID**: ``"4"``

#### Defined in

[token/constants.ts:25](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L25)

___

### GOERLI\_NETWORK\_ID

• **GOERLI\_NETWORK\_ID**: ``"5"``

#### Defined in

[token/constants.ts:26](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L26)

___

### KOVAN\_NETWORK\_ID

• **KOVAN\_NETWORK\_ID**: ``"42"``

#### Defined in

[token/constants.ts:27](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L27)

___

### LOCALHOST\_NETWRK\_ID

• **LOCALHOST\_NETWRK\_ID**: ``"1337"``

#### Defined in

[token/constants.ts:28](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L28)

___

### MAINNET\_CHAIN\_ID

• **MAINNET\_CHAIN\_ID**: ``"0x1"``

#### Defined in

[token/constants.ts:30](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L30)

___

### ROPSTEN\_CHAIN\_ID

• **ROPSTEN\_CHAIN\_ID**: ``"0x3"``

#### Defined in

[token/constants.ts:31](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L31)

___

### RINKEBY\_CHAIN\_ID

• **RINKEBY\_CHAIN\_ID**: ``"0x4"``

#### Defined in

[token/constants.ts:32](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L32)

___

### GOERLI\_CHAIN\_ID

• **GOERLI\_CHAIN\_ID**: ``"0x5"``

#### Defined in

[token/constants.ts:33](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L33)

___

### KOVAN\_CHAIN\_ID

• **KOVAN\_CHAIN\_ID**: ``"0x2a"``

#### Defined in

[token/constants.ts:34](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L34)

___

### LOCALHOST\_CHAIN\_ID

• **LOCALHOST\_CHAIN\_ID**: ``"0x539"``

#### Defined in

[token/constants.ts:35](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L35)

___

### BSC\_CHAIN\_ID

• **BSC\_CHAIN\_ID**: ``"0x38"``

#### Defined in

[token/constants.ts:36](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L36)

___

### OPTIMISM\_CHAIN\_ID

• **OPTIMISM\_CHAIN\_ID**: ``"0xa"``

#### Defined in

[token/constants.ts:37](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L37)

___

### OPTIMISM\_TESTNET\_CHAIN\_ID

• **OPTIMISM\_TESTNET\_CHAIN\_ID**: ``"0x45"``

#### Defined in

[token/constants.ts:38](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L38)

___

### POLYGON\_CHAIN\_ID

• **POLYGON\_CHAIN\_ID**: ``"0x89"``

#### Defined in

[token/constants.ts:39](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L39)

___

### MAX\_SAFE\_CHAIN\_ID

• **MAX\_SAFE\_CHAIN\_ID**: ``4503599627370476``

#### Defined in

[token/constants.ts:41](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L41)

___

### ROPSTEN\_DISPLAY\_NAME

• **ROPSTEN\_DISPLAY\_NAME**: ``"Ropsten"``

#### Defined in

[token/constants.ts:43](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L43)

___

### RINKEBY\_DISPLAY\_NAME

• **RINKEBY\_DISPLAY\_NAME**: ``"Rinkeby"``

#### Defined in

[token/constants.ts:44](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L44)

___

### KOVAN\_DISPLAY\_NAME

• **KOVAN\_DISPLAY\_NAME**: ``"Kovan"``

#### Defined in

[token/constants.ts:45](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L45)

___

### MAINNET\_DISPLAY\_NAME

• **MAINNET\_DISPLAY\_NAME**: ``"Ethereum Mainnet"``

#### Defined in

[token/constants.ts:46](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L46)

___

### GOERLI\_DISPLAY\_NAME

• **GOERLI\_DISPLAY\_NAME**: ``"Goerli"``

#### Defined in

[token/constants.ts:47](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L47)

___

### ROPSTEN\_RPC\_URL

• **ROPSTEN\_RPC\_URL**: `string`

#### Defined in

[token/constants.ts:52](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L52)

___

### RINKEBY\_RPC\_URL

• **RINKEBY\_RPC\_URL**: `string`

#### Defined in

[token/constants.ts:53](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L53)

___

### KOVAN\_RPC\_URL

• **KOVAN\_RPC\_URL**: `string`

#### Defined in

[token/constants.ts:54](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L54)

___

### MAINNET\_RPC\_URL

• **MAINNET\_RPC\_URL**: `string`

#### Defined in

[token/constants.ts:55](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L55)

___

### GOERLI\_RPC\_URL

• **GOERLI\_RPC\_URL**: `string`

#### Defined in

[token/constants.ts:56](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L56)

___

### ETH\_SYMBOL

• **ETH\_SYMBOL**: ``"ETH"``

#### Defined in

[token/constants.ts:58](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L58)

___

### WETH\_SYMBOL

• **WETH\_SYMBOL**: ``"WETH"``

#### Defined in

[token/constants.ts:59](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L59)

___

### TEST\_ETH\_SYMBOL

• **TEST\_ETH\_SYMBOL**: ``"TESTETH"``

#### Defined in

[token/constants.ts:60](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L60)

___

### BNB\_SYMBOL

• **BNB\_SYMBOL**: ``"BNB"``

#### Defined in

[token/constants.ts:61](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L61)

___

### MATIC\_SYMBOL

• **MATIC\_SYMBOL**: ``"MATIC"``

#### Defined in

[token/constants.ts:62](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L62)

___

### INFURA\_PROVIDER\_TYPES

• **INFURA\_PROVIDER\_TYPES**: `string`[]

#### Defined in

[token/constants.ts:64](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L64)

___

### TEST\_CHAINS

• **TEST\_CHAINS**: `string`[]

#### Defined in

[token/constants.ts:66](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L66)

___

### NETWORK\_TYPE\_TO\_ID\_MAP

• **NETWORK\_TYPE\_TO\_ID\_MAP**: `Object`

Map of all build-in Infura networks to their network and chain IDs.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ropsten` | { `networkId`: `string` = ROPSTEN\_NETWORK\_ID; `chainId`: `string` = ROPSTEN\_CHAIN\_ID } |
| `ropsten.networkId` | `string` |
| `ropsten.chainId` | `string` |
| `rinkeby` | { `networkId`: `string` = RINKEBY\_NETWORK\_ID; `chainId`: `string` = RINKEBY\_CHAIN\_ID } |
| `rinkeby.networkId` | `string` |
| `rinkeby.chainId` | `string` |
| `kovan` | { `networkId`: `string` = KOVAN\_NETWORK\_ID; `chainId`: `string` = KOVAN\_CHAIN\_ID } |
| `kovan.networkId` | `string` |
| `kovan.chainId` | `string` |
| `goerli` | { `networkId`: `string` = GOERLI\_NETWORK\_ID; `chainId`: `string` = GOERLI\_CHAIN\_ID } |
| `goerli.networkId` | `string` |
| `goerli.chainId` | `string` |
| `mainnet` | { `networkId`: `string` = MAINNET\_NETWORK\_ID; `chainId`: `string` = MAINNET\_CHAIN\_ID } |
| `mainnet.networkId` | `string` |
| `mainnet.chainId` | `string` |

#### Defined in

[token/constants.ts:76](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L76)

___

### MAINNET\_TOKENS

• **MAINNET\_TOKENS**: `any`

#### Defined in

[token/constants.ts:84](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L84)

___

### MAINNET\_TOKEN\_ADDRESS\_TO\_TOKEN\_MAP

• **MAINNET\_TOKEN\_ADDRESS\_TO\_TOKEN\_MAP**: `unknown`

#### Defined in

[token/constants.ts:88](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L88)

___

### NETWORK\_TYPE\_TO\_TOKENS

• **NETWORK\_TYPE\_TO\_TOKENS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ropsten` | `any`[] |
| `rinkeby` | `any`[] |
| `kovan` | `any`[] |
| `goerli` | `any`[] |
| `mainnet` | `any` |

#### Defined in

[token/constants.ts:110](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L110)

___

### NETWORK\_TYPE\_TO\_UNISWAP\_V3

• **NETWORK\_TYPE\_TO\_UNISWAP\_V3**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ropsten` | `any` |
| `rinkeby` | `any` |
| `kovan` | `any` |
| `goerli` | `any` |
| `mainnet` | `any` |

#### Defined in

[token/constants.ts:126](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L126)

___

### NETWORK\_TYPE\_TO\_UNISWAP\_V2

• **NETWORK\_TYPE\_TO\_UNISWAP\_V2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ropsten` | `any` |
| `rinkeby` | `any` |
| `kovan` | `any` |
| `goerli` | `any` |
| `mainnet` | `any` |

#### Defined in

[token/constants.ts:134](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L134)

___

### NETWORK\_TO\_NAME\_MAP

• **NETWORK\_TO\_NAME\_MAP**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ropsten` | `string` |
| `rinkeby` | `string` |
| `kovan` | `string` |
| `mainnet` | `string` |
| `goerli` | `string` |
| `3` | `string` |
| `4` | `string` |
| `42` | `string` |
| `5` | `string` |
| `1` | `string` |
| `0x3` | `string` |
| `0x4` | `string` |
| `0x2a` | `string` |
| `0x5` | `string` |
| `0x1` | `string` |

#### Defined in

[token/constants.ts:142](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L142)

___

### CHAIN\_ID\_TO\_TYPE\_MAP

• **CHAIN\_ID\_TO\_TYPE\_MAP**: `Object`

#### Defined in

[token/constants.ts:162](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L162)

___

### CHAIN\_ID\_TO\_RPC\_URL\_MAP

• **CHAIN\_ID\_TO\_RPC\_URL\_MAP**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `0x3` | `string` |
| `0x4` | `string` |
| `0x2a` | `string` |
| `0x5` | `string` |
| `0x1` | `string` |

#### Defined in

[token/constants.ts:169](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L169)

___

### CHAIN\_ID\_TO\_NETWORK\_ID\_MAP

• **CHAIN\_ID\_TO\_NETWORK\_ID\_MAP**: `Object`

#### Defined in

[token/constants.ts:177](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L177)

___

### ERC20\_ALLOWANCE\_ABI

• **ERC20\_ALLOWANCE\_ABI**: `string`[]

#### Defined in

[token/constants.ts:184](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L184)

## Functions

### getRpcUrl

▸ `Const` **getRpcUrl**(`network`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `any` |

#### Returns

`string`

#### Defined in

[token/constants.ts:49](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/token/constants.ts#L49)
