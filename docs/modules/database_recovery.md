[](../README.md) / [Exports](../modules.md) / database\_recovery

# Module: database\_recovery

Recovery model definition

## Table of contents

### Functions

- [add](database_recovery.md#add)
- [findByUserID](database_recovery.md#findbyuserid)
- [remove](database_recovery.md#remove)
- [updateOrAdd](database_recovery.md#updateoradd)

## Functions

### add

▸ **add**(`user_id`, `name`, `desc`, `total_shared_num`, `threshold`, `friends`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `name` | `any` |
| `desc` | `any` |
| `total_shared_num` | `any` |
| `threshold` | `any` |
| `friends` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_recovery.ts:73](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_recovery.ts#L73)

___

### findByUserID

▸ **findByUserID**(`user_id`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_recovery.ts:91](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_recovery.ts#L91)

___

### remove

▸ **remove**(`id`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_recovery.ts:95](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_recovery.ts#L95)

___

### updateOrAdd

▸ **updateOrAdd**(`user_id`, `name`, `desc`, `total_shared_num`, `threshold`, `friends`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `name` | `any` |
| `desc` | `any` |
| `total_shared_num` | `any` |
| `threshold` | `any` |
| `friends` | `any` |

#### Returns

`void`

#### Defined in

[model/database_recovery.ts:99](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_recovery.ts#L99)
