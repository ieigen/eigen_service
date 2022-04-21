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
- [findLatestTxByWalletId](database_wallet_history.md#findlatesttxbywalletid)
- [findLatestByTxid](database_wallet_history.md#findlatestbytxid)
- [findLatestRecoverActionByWalletId](database_wallet_history.md#findlatestrecoveractionbywalletid)
- [findLatestRecoveringByWalletId](database_wallet_history.md#findlatestrecoveringbywalletid)

## Functions

### add

▸ **add**(`wallet_id`, `from`, `to`, `txid`, `cause`, `data?`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `wallet_id` | `number` | `undefined` |
| `from` | [`WalletStatus`](../enums/database_wallet.WalletStatus.md) | `undefined` |
| `to` | [`WalletStatus`](../enums/database_wallet.WalletStatus.md) | `undefined` |
| `txid` | `string` | `undefined` |
| `cause` | [`StatusTransitionCause`](../enums/database_wallet_history.StatusTransitionCause.md) | `undefined` |
| `data` | `string` | `""` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:93](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L93)

___

### findOne

▸ **findOne**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:111](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L111)

___

### findAllByWalletId

▸ **findAllByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet_history.ts:115](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L115)

___

### findLatestByWalletId

▸ **findLatestByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:123](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L123)

___

### findLatestTxByWalletId

▸ **findLatestTxByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:132](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L132)

___

### findLatestByTxid

▸ **findLatestByTxid**(`txid`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet_history.ts:149](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L149)

___

### findLatestRecoverActionByWalletId

▸ **findLatestRecoverActionByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:158](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L158)

___

### findLatestRecoveringByWalletId

▸ **findLatestRecoveringByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet_history.ts:175](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet_history.ts#L175)
