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

[model/database_id.ts:81](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L81)

___

### findAll

▸ `Const` **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id.ts:85](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L85)

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

[model/database_id.ts:89](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L89)

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

[model/database_id.ts:98](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L98)

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

[model/database_id.ts:107](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L107)

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

[model/database_id.ts:116](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L116)

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

[model/database_id.ts:140](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L140)

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

[model/database_id.ts:161](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L161)

___

### findAllUserIDs

▸ `Const` **findAllUserIDs**(): `Promise`<`Set`<`unknown`\>\>

#### Returns

`Promise`<`Set`<`unknown`\>\>

#### Defined in

[model/database_id.ts:173](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_id.ts#L173)
