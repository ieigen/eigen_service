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

▸ `Const` **add**(`user_id`, `name`, `desc`, `total_shared_num`, `threshold`, `friends`): `Promise`<`Model`<`any`, `any`\>\>

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

[model/database_recovery.ts:58](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_recovery.ts#L58)

___

### findByUserID

▸ `Const` **findByUserID**(`user_id`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_recovery.ts:76](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_recovery.ts#L76)

___

### remove

▸ `Const` **remove**(`id`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_recovery.ts:80](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_recovery.ts#L80)

___

### updateOrAdd

▸ `Const` **updateOrAdd**(`user_id`, `name`, `desc`, `total_shared_num`, `threshold`, `friends`): `void`

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

[model/database_recovery.ts:84](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_recovery.ts#L84)
