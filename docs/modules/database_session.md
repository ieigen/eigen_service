[](../README.md) / [Exports](../modules.md) / database\_session

# Module: database\_session

Session model definition

## Table of contents

### Functions

- [add](database_session.md#add)
- [findOne](database_session.md#findone)
- [findAll](database_session.md#findall)
- [updateOrAdd](database_session.md#updateoradd)
- [deleteSession](database_session.md#deletesession)

## Functions

### add

▸ **add**(`hash_code`, `token`, `expiry`, `issue_time`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash_code` | `any` |
| `token` | `any` |
| `expiry` | `any` |
| `issue_time` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_session.ts:91](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_session.ts#L91)

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

[model/database_session.ts:100](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_session.ts#L100)

___

### findAll

▸ **findAll**(`dict`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_session.ts:103](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_session.ts#L103)

___

### updateOrAdd

▸ **updateOrAdd**(`hash_code`, `token`, `expiry`, `issue_time`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash_code` | `any` |
| `token` | `any` |
| `expiry` | `any` |
| `issue_time` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_session.ts:107](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_session.ts#L107)

___

### deleteSession

▸ **deleteSession**(`hash_code`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash_code` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_session.ts:133](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_session.ts#L133)
