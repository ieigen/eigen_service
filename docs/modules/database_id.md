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

[model/database_id.ts:86](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L86)

___

### findAll

▸ **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id.ts:90](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L90)

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

[model/database_id.ts:94](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L94)

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

[model/database_id.ts:103](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L103)

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

[model/database_id.ts:112](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L112)

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

[model/database_id.ts:121](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L121)

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

[model/database_id.ts:145](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L145)

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

[model/database_id.ts:166](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L166)

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

[model/database_id.ts:187](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L187)

___

### findAllUserIDs

▸ **findAllUserIDs**(): `Promise`<`Set`<`unknown`\>\>

#### Returns

`Promise`<`Set`<`unknown`\>\>

#### Defined in

[model/database_id.ts:199](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id.ts#L199)
