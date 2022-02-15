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

• **TX\_TYPE\_L1ToL1**: ``0``

#### Defined in

[model/database_transaction_history.ts:54](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L54)

___

### TX\_TYPE\_L1ToL2

• **TX\_TYPE\_L1ToL2**: ``1``

#### Defined in

[model/database_transaction_history.ts:55](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L55)

___

### TX\_TYPE\_L2ToL1

• **TX\_TYPE\_L2ToL1**: ``2``

#### Defined in

[model/database_transaction_history.ts:56](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L56)

___

### TX\_TYPE\_L2ToL2

• **TX\_TYPE\_L2ToL2**: ``3``

#### Defined in

[model/database_transaction_history.ts:57](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L57)

___

### FROM\_TYPE\_ACCOUNT

• **FROM\_TYPE\_ACCOUNT**: ``0``

#### Defined in

[model/database_transaction_history.ts:59](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L59)

___

### FROM\_TYPE\_WALLET

• **FROM\_TYPE\_WALLET**: ``1``

#### Defined in

[model/database_transaction_history.ts:60](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L60)

## Functions

### add

▸ `Const` **add**(`dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_transaction_history.ts:93](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L93)

___

### getByTxid

▸ `Const` **getByTxid**(`txid`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_transaction_history.ts:111](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L111)

___

### delByTxid

▸ `Const` **delByTxid**(`txid`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_transaction_history.ts:115](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L115)

___

### search

▸ `Const` **search**(`filter_dict`, `page`, `page_size`, `order`): `Promise`<{ `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

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

[model/database_transaction_history.ts:119](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L119)

___

### search\_with\_multisig

▸ `Const` **search_with_multisig**(`as_owners`, `as_signers`, `other_filters`, `page`, `page_size`, `order`): `Promise`<{ `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

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

[model/database_transaction_history.ts:155](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L155)

___

### search\_both\_sizes

▸ `Const` **search_both_sizes**(`filter_dict`, `page`, `page_size`, `order`): `Promise`<`Model`<`any`, `any`\>[] \| { `transactions`: `Model`<`any`, `any`\>[] = rows; `total_page`: `number`  }\>

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

[model/database_transaction_history.ts:190](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L190)

___

### findAll

▸ `Const` **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_transaction_history.ts:240](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L240)

___

### updateOrAdd

▸ `Const` **updateOrAdd**(`txid`, `update_dict`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |
| `update_dict` | `any` |

#### Returns

`void`

#### Defined in

[model/database_transaction_history.ts:244](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L244)

___

### account\_count\_l2

▸ `Const` **account_count_l2**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_transaction_history.ts:267](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L267)

___

### transaction\_count\_l2

▸ `Const` **transaction_count_l2**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_transaction_history.ts:302](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_transaction_history.ts#L302)
