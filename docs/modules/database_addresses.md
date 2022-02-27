[](../README.md) / [Exports](../modules.md) / database\_addresses

# Module: database\_addresses

Addresses model definition

## Table of contents

### Functions

- [add](database_addresses.md#add)
- [findOne](database_addresses.md#findone)
- [findAll](database_addresses.md#findall)
- [updateOrAdd](database_addresses.md#updateoradd)

## Functions

### add

▸ `Const` **add**(`user_id`, `network_id`, `user_address`, `cipher_key`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `network_id` | `any` |
| `user_address` | `any` |
| `cipher_key` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_address.ts:80](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_address.ts#L80)

___

### findOne

▸ `Const` **findOne**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_address.ts:89](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_address.ts#L89)

___

### findAll

▸ `Const` **findAll**(`dict`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_address.ts:92](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_address.ts#L92)

___

### updateOrAdd

▸ `Const` **updateOrAdd**(`user_id`, `network_id`, `user_address`, `cipher_key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `network_id` | `any` |
| `user_address` | `any` |
| `cipher_key` | `any` |

#### Returns

`void`

#### Defined in

[model/database_address.ts:96](https://github.com/ieigen/eigen_service/blob/5c9c266/src/model/database_address.ts#L96)
