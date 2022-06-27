[](../README.md) / [Exports](../modules.md) / database\_transaction\_history

# Module: database\_transaction\_history

Transaction history model definition

## Table of contents

### Enumerations

- [TransactionStatus](../enums/database_transaction_history.TransactionStatus.md)

### Variables

- [TX\_TYPE\_L1ToL1](database_transaction_history.md#tx_type_l1tol1)
- [TX\_TYPE\_L1ToL2](database_transaction_history.md#tx_type_l1tol2)
- [TX\_TYPE\_L2ToL1](database_transaction_history.md#tx_type_l2tol1)
- [TX\_TYPE\_L2ToL2](database_transaction_history.md#tx_type_l2tol2)
- [FROM\_TYPE\_ACCOUNT](database_transaction_history.md#from_type_account)
- [FROM\_TYPE\_WALLET](database_transaction_history.md#from_type_wallet)

### Functions

- [add](database_transaction_history.md#add)
- [getByTxid](database_transaction_history.md#getbytxid)
- [delByTxid](database_transaction_history.md#delbytxid)
- [search](database_transaction_history.md#search)
- [search\_with\_multisig](database_transaction_history.md#search_with_multisig)
- [search\_both\_sizes](database_transaction_history.md#search_both_sizes)
- [findAll](database_transaction_history.md#findall)
- [updateOrAdd](database_transaction_history.md#updateoradd)
- [account\_count\_l2](database_transaction_history.md#account_count_l2)
- [transaction\_count\_l2](database_transaction_history.md#transaction_count_l2)

## Variables

### TX\_TYPE\_L1ToL1

• `Const` **TX\_TYPE\_L1ToL1**: ``0``

#### Defined in

[model/database_transaction_history.ts:79](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L79)

___

### TX\_TYPE\_L1ToL2

• `Const` **TX\_TYPE\_L1ToL2**: ``1``

#### Defined in

[model/database_transaction_history.ts:80](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L80)

___

### TX\_TYPE\_L2ToL1

• `Const` **TX\_TYPE\_L2ToL1**: ``2``

#### Defined in

[model/database_transaction_history.ts:81](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L81)

___

### TX\_TYPE\_L2ToL2

• `Const` **TX\_TYPE\_L2ToL2**: ``3``

#### Defined in

[model/database_transaction_history.ts:82](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L82)

___

### FROM\_TYPE\_ACCOUNT

• `Const` **FROM\_TYPE\_ACCOUNT**: ``0``

#### Defined in

[model/database_transaction_history.ts:84](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L84)

___

### FROM\_TYPE\_WALLET

• `Const` **FROM\_TYPE\_WALLET**: ``1``

#### Defined in

[model/database_transaction_history.ts:85](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L85)

## Functions

### add

▸ **add**(`dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_transaction_history.ts:118](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L118)

___

### getByTxid

▸ **getByTxid**(`txid`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_transaction_history.ts:136](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L136)

___

### delByTxid

▸ **delByTxid**(`txid`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_transaction_history.ts:140](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L140)

___

### search

▸ **search**(`filter_dict`, `page`, `page_size`, `order`): `Promise`<{ `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |
| `page` | `any` |
| `page_size` | `any` |
| `order` | `any` |

#### Returns

`Promise`<{ `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

#### Defined in

[model/database_transaction_history.ts:144](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L144)

___

### search\_with\_multisig

▸ **search_with_multisig**(`as_owners`, `as_signers`, `other_filters`, `page`, `page_size`, `order`): `Promise`<{ `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `as_owners` | `string`[] |
| `as_signers` | `string`[] |
| `other_filters` | `any` |
| `page` | `any` |
| `page_size` | `any` |
| `order` | `any` |

#### Returns

`Promise`<{ `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

#### Defined in

[model/database_transaction_history.ts:180](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L180)

___

### search\_both\_sizes

▸ **search_both_sizes**(`filter_dict`, `page`, `page_size`, `order`): `Promise`<`Model`<`any`, `any`\>[] \| { `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |
| `page` | `any` |
| `page_size` | `any` |
| `order` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[] \| { `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

#### Defined in

[model/database_transaction_history.ts:215](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L215)

___

### findAll

▸ **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_transaction_history.ts:265](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L265)

___

### updateOrAdd

▸ **updateOrAdd**(`txid`, `update_dict`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |
| `update_dict` | `any` |

#### Returns

`void`

#### Defined in

[model/database_transaction_history.ts:269](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L269)

___

### account\_count\_l2

▸ **account_count_l2**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_transaction_history.ts:292](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L292)

___

### transaction\_count\_l2

▸ **transaction_count_l2**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_transaction_history.ts:327](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_transaction_history.ts#L327)
