[](../README.md) / [Exports](../modules.md) / service

# Module: service

The service implementation for eigen_service

## Table of contents

### Functions

- [getStores](service.md#getstores)
- [getStore](service.md#getstore)
- [postStore](service.md#poststore)
- [putStore](service.md#putstore)
- [getRecovery](service.md#getrecovery)
- [deleteRecovery](service.md#deleterecovery)
- [postRecovery](service.md#postrecovery)
- [getTxhs](service.md#gettxhs)
- [getTxh](service.md#gettxh)
- [postTxh](service.md#posttxh)
- [putTxh](service.md#puttxh)
- [postMeta](service.md#postmeta)
- [putMeta](service.md#putmeta)
- [getMeta](service.md#getmeta)
- [postSign](service.md#postsign)
- [getSign](service.md#getsign)
- [getUser](service.md#getuser)
- [postUser](service.md#postuser)
- [postGuardian](service.md#postguardian)
- [putGuardian](service.md#putguardian)
- [deleteGuardian](service.md#deleteguardian)
- [putOtpauth](service.md#putotpauth)
- [postOtpauth](service.md#postotpauth)
- [getStatistics](service.md#getstatistics)
- [postAllowance](service.md#postallowance)
- [getAllowance](service.md#getallowance)
- [getAllowances](service.md#getallowances)
- [postAddress](service.md#postaddress)
- [getAddresses](service.md#getaddresses)
- [getFriendsAddresses](service.md#getfriendsaddresses)
- [deleteAddress](service.md#deleteaddress)

## Functions

### getStores

▸ **getStores**(`req`, `res`): `Promise`<`any`\>

Stores public key

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:56](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L56)

___

### getStore

▸ **getStore**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:60](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L60)

___

### postStore

▸ **postStore**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:75](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L75)

___

### putStore

▸ **putStore**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:88](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L88)

___

### getRecovery

▸ **getRecovery**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:105](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L105)

___

### deleteRecovery

▸ **deleteRecovery**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:125](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L125)

___

### postRecovery

▸ **postRecovery**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:144](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L144)

___

### getTxhs

▸ **getTxhs**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:179](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L179)

___

### getTxh

▸ **getTxh**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:293](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L293)

___

### postTxh

▸ **postTxh**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:323](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L323)

___

### putTxh

▸ **putTxh**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:385](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L385)

___

### postMeta

▸ **postMeta**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:398](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L398)

___

### putMeta

▸ **putMeta**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:412](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L412)

___

### getMeta

▸ **getMeta**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:420](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L420)

___

### postSign

▸ **postSign**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:441](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L441)

___

### getSign

▸ **getSign**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:456](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L456)

___

### getUser

▸ **getUser**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:533](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L533)

___

### postUser

▸ **postUser**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:626](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L626)

___

### postGuardian

▸ **postGuardian**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:652](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L652)

___

### putGuardian

▸ **putGuardian**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:726](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L726)

___

### deleteGuardian

▸ **deleteGuardian**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:833](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L833)

___

### putOtpauth

▸ **putOtpauth**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:910](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L910)

___

### postOtpauth

▸ **postOtpauth**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:942](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L942)

___

### getStatistics

▸ **getStatistics**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:979](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L979)

___

### postAllowance

▸ **postAllowance**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:1004](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1004)

___

### getAllowance

▸ **getAllowance**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:1043](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1043)

___

### getAllowances

▸ **getAllowances**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:1090](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1090)

___

### postAddress

▸ **postAddress**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:1175](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1175)

___

### getAddresses

▸ **getAddresses**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:1205](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1205)

___

### getFriendsAddresses

▸ **getFriendsAddresses**(`req`, `res`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[service.ts:1252](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1252)

___

### deleteAddress

▸ **deleteAddress**(`req`, `res`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[service.ts:1317](https://github.com/ieigen/eigen_service/blob/1208a86/src/service.ts#L1317)
