[](../README.md) / [Exports](../modules.md) / database\_multisig

# Module: database\_multisig

Multi signature model definition

## Table of contents

### Enumerations

- [SignOperation](../enums/database_multisig.SignOperation.md)

### Variables

- [signHistoryDB](database_multisig.md#signhistorydb)

### Functions

- [addMultisigMeta](database_multisig.md#addmultisigmeta)
- [findMultisigMetaByConds](database_multisig.md#findmultisigmetabyconds)
- [updateMultisigMeta](database_multisig.md#updatemultisigmeta)
- [addSignMessage](database_multisig.md#addsignmessage)
- [findSignHistoryByMtxid](database_multisig.md#findsignhistorybymtxid)
- [findLatestRecoveryMtxidByWalletAddress](database_multisig.md#findlatestrecoverymtxidbywalletaddress)
- [getRecoverySignMessages](database_multisig.md#getrecoverysignmessages)
- [getSignatures](database_multisig.md#getsignatures)

## Variables

### signHistoryDB

• `Const` **signHistoryDB**: `ModelCtor`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:89](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L89)

## Functions

### addMultisigMeta

▸ **addMultisigMeta**(`network_id`, `user_id`, `wallet_address`, `to`, `value`, `data`, `operation`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `user_id` | `any` |
| `wallet_address` | `any` |
| `to` | `any` |
| `value` | `any` |
| `data` | `any` |
| `operation` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:155](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L155)

___

### findMultisigMetaByConds

▸ **findMultisigMetaByConds**(`conds`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `conds` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:189](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L189)

___

### updateMultisigMeta

▸ **updateMultisigMeta**(`id`, `txid`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `txid` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_multisig.ts:193](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L193)

___

### addSignMessage

▸ **addSignMessage**(`mtxid`, `signer_address`, `sign_message`, `status`, `operation`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mtxid` | `any` |
| `signer_address` | `any` |
| `sign_message` | `any` |
| `status` | `any` |
| `operation` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:222](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L222)

___

### findSignHistoryByMtxid

▸ **findSignHistoryByMtxid**(`mtxid`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mtxid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_multisig.ts:238](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L238)

___

### findLatestRecoveryMtxidByWalletAddress

▸ **findLatestRecoveryMtxidByWalletAddress**(`wallet_address`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_address` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:242](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L242)

___

### getRecoverySignMessages

▸ **getRecoverySignMessages**(`mtxid`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mtxid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_multisig.ts:250](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L250)

___

### getSignatures

▸ **getSignatures**(`sign_messages`, `returnBadSignatures?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sign_messages` | `any` | `undefined` |
| `returnBadSignatures` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

[model/database_multisig.ts:259](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_multisig.ts#L259)
