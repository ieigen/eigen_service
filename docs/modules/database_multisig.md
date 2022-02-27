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

• **signHistoryDB**: `ModelCtor`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:74](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L74)

## Functions

### addMultisigMeta

▸ `Const` **addMultisigMeta**(`network_id`, `user_id`, `wallet_address`, `to`, `value`, `data`, `operation`): `Promise`<`Model`<`any`, `any`\>\>

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

[model/database_multisig.ts:140](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L140)

___

### findMultisigMetaByConds

▸ `Const` **findMultisigMetaByConds**(`conds`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `conds` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:174](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L174)

___

### updateMultisigMeta

▸ `Const` **updateMultisigMeta**(`id`, `txid`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `txid` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_multisig.ts:178](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L178)

___

### addSignMessage

▸ `Const` **addSignMessage**(`mtxid`, `signer_address`, `sign_message`, `status`, `operation`): `Promise`<`Model`<`any`, `any`\>\>

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

[model/database_multisig.ts:207](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L207)

___

### findSignHistoryByMtxid

▸ `Const` **findSignHistoryByMtxid**(`mtxid`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mtxid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_multisig.ts:223](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L223)

___

### findLatestRecoveryMtxidByWalletAddress

▸ `Const` **findLatestRecoveryMtxidByWalletAddress**(`wallet_address`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_address` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_multisig.ts:227](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L227)

___

### getRecoverySignMessages

▸ `Const` **getRecoverySignMessages**(`mtxid`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mtxid` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_multisig.ts:235](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L235)

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

[model/database_multisig.ts:244](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_multisig.ts#L244)
