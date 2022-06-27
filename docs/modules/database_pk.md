[](../README.md) / [Exports](../modules.md) / database\_pk

# Module: database\_pk

Public key model definition

## Table of contents

### Functions

- [add](database_pk.md#add)
- [findByDigest](database_pk.md#findbydigest)
- [findAll](database_pk.md#findall)
- [updateOrAdd](database_pk.md#updateoradd)

## Functions

### add

▸ **add**(`digest`, `pk`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `digest` | `any` |
| `pk` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_pk.ts:65](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_pk.ts#L65)

___

### findByDigest

▸ **findByDigest**(`dig`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dig` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_pk.ts:72](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_pk.ts#L72)

___

### findAll

▸ **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_pk.ts:76](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_pk.ts#L76)

___

### updateOrAdd

▸ **updateOrAdd**(`old_dig`, `new_dig`, `new_pk`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `old_dig` | `any` |
| `new_dig` | `any` |
| `new_pk` | `any` |

#### Returns

`void`

#### Defined in

[model/database_pk.ts:80](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_pk.ts#L80)
