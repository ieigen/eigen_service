[](../README.md) / [Exports](../modules.md) / database\_addresses

# Module: database\_addresses

Addresses model definition

## Table of contents

### Functions

- [add](database_addresses.md#add)
- [findOne](database_addresses.md#findone)
- [findAll](database_addresses.md#findall)
- [updateOrAdd](database_addresses.md#updateoradd)
- [deleteAddress](database_addresses.md#deleteaddress)

## Functions

### add

▸ **add**(`user_id`, `network_id`, `user_address`, `cipher_key`): `Promise`<`Model`<`any`, `any`\>\>

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

[model/database_address.ts:95](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_address.ts#L95)

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

[model/database_address.ts:104](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_address.ts#L104)

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

[model/database_address.ts:107](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_address.ts#L107)

___

### updateOrAdd

▸ **updateOrAdd**(`user_id`, `network_id`, `user_address`, `cipher_key`): `void`

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

[model/database_address.ts:111](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_address.ts#L111)

___

### deleteAddress

▸ **deleteAddress**(`address`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_address.ts:123](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_address.ts#L123)
