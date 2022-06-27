[](../README.md) / [Exports](../modules.md) / database\_stealth\_address

# Module: database\_stealth\_address

Stealth address model definition

## Table of contents

### Enumerations

- [StealthAddressStatus](../enums/database_stealth_address.StealthAddressStatus.md)

### Functions

- [add](database_stealth_address.md#add)
- [findAll](database_stealth_address.md#findall)
- [updateStatus](database_stealth_address.md#updatestatus)

## Functions

### add

▸ **add**(`message`, `user_id`, `sender_public_key`, `sender_address`, `stealth_public_key`, `stealth_address`, `receiver_address`, `nonce`, `amount`, `token_name`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |
| `user_id` | `any` |
| `sender_public_key` | `any` |
| `sender_address` | `any` |
| `stealth_public_key` | `any` |
| `stealth_address` | `any` |
| `receiver_address` | `any` |
| `nonce` | `any` |
| `amount` | `any` |
| `token_name` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_stealth_address.ts:92](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_stealth_address.ts#L92)

___

### findAll

▸ **findAll**(`filter`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_stealth_address.ts:119](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_stealth_address.ts#L119)

___

### updateStatus

▸ **updateStatus**(`message`, `status`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |
| `status` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_stealth_address.ts:123](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_stealth_address.ts#L123)
