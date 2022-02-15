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

▸ `Const` **add**(`digest`, `pk`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `digest` | `any` |
| `pk` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_pk.ts:46](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_pk.ts#L46)

___

### findByDigest

▸ `Const` **findByDigest**(`dig`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dig` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_pk.ts:53](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_pk.ts#L53)

___

### findAll

▸ `Const` **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_pk.ts:57](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_pk.ts#L57)

___

### updateOrAdd

▸ `Const` **updateOrAdd**(`old_dig`, `new_dig`, `new_pk`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `old_dig` | `any` |
| `new_dig` | `any` |
| `new_pk` | `any` |

#### Returns

`void`

#### Defined in

[model/database_pk.ts:61](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_pk.ts#L61)
