[](../README.md) / [Exports](../modules.md) / database\_wallet\_history

# Module: database\_wallet\_history

Wallet history model definition

## Table of contents

### Enumerations

- [StatusTransitionCause](../enums/database_wallet_history.StatusTransitionCause.md)

### Functions

- [add](database_wallet_history.md#add)
- [findOne](database_wallet_history.md#findone)
- [findAllByWalletId](database_wallet_history.md#findallbywalletid)
- [findLatestByWalletId](database_wallet_history.md#findlatestbywalletid)
- [findLatestByTxid](database_wallet_history.md#findlatestbytxid)

## Functions

### add

▸ `Const` **add**(`wallet_id`, `from`, `to`, `txid`, `cause`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |
| `from` | `any` |
| `to` | `any` |
| `txid` | `any` |
| `cause` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:85](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet_history.ts#L85)

___

### findOne

▸ `Const` **findOne**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:95](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet_history.ts#L95)

___

### findAllByWalletId

▸ `Const` **findAllByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet_history.ts:99](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet_history.ts#L99)

___

### findLatestByWalletId

▸ `Const` **findLatestByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet_history.ts:107](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet_history.ts#L107)

___

### findLatestByTxid

▸ `Const` **findLatestByTxid**(`txid`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet_history.ts:116](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet_history.ts#L116)
