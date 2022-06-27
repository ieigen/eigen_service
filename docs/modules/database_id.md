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
- [updatePasswordHash](database_id.md#updatepasswordhash)
- [findUsersInformation](database_id.md#findusersinformation)
- [findAllUserIDs](database_id.md#findalluserids)

## Functions

### add

▸ **add**(`user_info`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_info` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_id.ts:101](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L101)

___

### findAll

▸ **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id.ts:105](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L105)

___

### findByID

▸ **findByID**(`user_id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:109](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L109)

___

### findByOpenID

▸ **findByOpenID**(`id`, `kind`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `kind` | `number` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:118](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L118)

___

### findByEmail

▸ **findByEmail**(`email`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:127](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L127)

___

### updateOrAdd

▸ **updateOrAdd**(`user_id`, `new_info`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `new_info` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:136](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L136)

___

### updateSecret

▸ **updateSecret**(`user_id`, `secret`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `secret` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:160](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L160)

___

### updatePasswordHash

▸ **updatePasswordHash**(`user_id`, `password_hash`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `password_hash` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id.ts:181](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L181)

___

### findUsersInformation

▸ **findUsersInformation**(`ids`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id.ts:202](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L202)

___

### findAllUserIDs

▸ **findAllUserIDs**(): `Promise`<`Set`<`unknown`\>\>

#### Returns

`Promise`<`Set`<`unknown`\>\>

#### Defined in

[model/database_id.ts:214](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_id.ts#L214)
