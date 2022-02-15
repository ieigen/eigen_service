[](../README.md) / [Exports](../modules.md) / database\_id

# Module: database\_id

User information model definition

## Table of contents

### Enumerations

- [UserKind](../enums/database_id.UserKind.md)

### Functions

- [add](database_id.md#add)
- [findAll](database_id.md#findall)
- [findByID](database_id.md#findbyid)
- [findByOpenID](database_id.md#findbyopenid)
- [findByEmail](database_id.md#findbyemail)
- [updateOrAdd](database_id.md#updateoradd)
- [updateSecret](database_id.md#updatesecret)
- [findUsersInformation](database_id.md#findusersinformation)
- [findAllUserIDs](database_id.md#findalluserids)

## Functions

### add

▸ `Const` **add**(`user_info`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_info` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_id.ts:74](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L74)

___

### findAll

▸ `Const` **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id.ts:78](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L78)

___

### findByID

▸ `Const` **findByID**(`user_id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:82](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L82)

___

### findByOpenID

▸ `Const` **findByOpenID**(`id`, `kind`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `kind` | `number` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:91](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L91)

___

### findByEmail

▸ `Const` **findByEmail**(`email`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:100](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L100)

___

### updateOrAdd

▸ `Const` **updateOrAdd**(`user_id`, `new_info`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `new_info` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:109](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L109)

___

### updateSecret

▸ `Const` **updateSecret**(`user_id`, `secret`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `secret` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:133](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L133)

___

### findUsersInformation

▸ `Const` **findUsersInformation**(`ids`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id.ts:154](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L154)

___

### findAllUserIDs

▸ `Const` **findAllUserIDs**(): `Promise`<`Set`<`unknown`\>\>

#### Returns

`Promise`<`Set`<`unknown`\>\>

#### Defined in

[model/database_id.ts:166](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_id.ts#L166)
