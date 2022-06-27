[](../README.md) / [Exports](../modules.md) / database\_allowance

# Module: database\_allowance

Allowance management model definition

## Table of contents

### Functions

- [add](database_allowance.md#add)
- [updateOrAdd](database_allowance.md#updateoradd)
- [get](database_allowance.md#get)
- [findAllAllowancesGreaterThanZero](database_allowance.md#findallallowancesgreaterthanzero)
- [get\_allowance](database_allowance.md#get_allowance)

## Functions

### add

▸ **add**(`network_id`, `token_address`, `user_address`, `swap_address`, `allowance`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `token_address` | `any` |
| `user_address` | `any` |
| `swap_address` | `any` |
| `allowance` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[token/allowance.ts:99](https://github.com/ieigen/eigen_service/blob/1208a86/src/token/allowance.ts#L99)

___

### updateOrAdd

▸ **updateOrAdd**(`network_id`, `token_address`, `user_address`, `swap_address`, `allowance`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `token_address` | `any` |
| `user_address` | `any` |
| `swap_address` | `any` |
| `allowance` | `any` |

#### Returns

`void`

#### Defined in

[token/allowance.ts:115](https://github.com/ieigen/eigen_service/blob/1208a86/src/token/allowance.ts#L115)

___

### get

▸ **get**(`network_id`, `token_address`, `user_address`, `swap_address`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `token_address` | `any` |
| `user_address` | `any` |
| `swap_address` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[token/allowance.ts:156](https://github.com/ieigen/eigen_service/blob/1208a86/src/token/allowance.ts#L156)

___

### findAllAllowancesGreaterThanZero

▸ **findAllAllowancesGreaterThanZero**(`network_id`, `user_address`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `user_address` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[token/allowance.ts:162](https://github.com/ieigen/eigen_service/blob/1208a86/src/token/allowance.ts#L162)

___

### get\_allowance

▸ **get_allowance**(`network`, `user_address`, `token_address`, `swap_address`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `any` |
| `user_address` | `any` |
| `token_address` | `any` |
| `swap_address` | `any` |

#### Returns

`void`

#### Defined in

[token/allowance.ts:186](https://github.com/ieigen/eigen_service/blob/1208a86/src/token/allowance.ts#L186)
