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

▸ `Const` **add**(`network_id`, `token_address`, `user_address`, `swap_address`, `allowance`): `Promise`<`Model`<`any`, `any`\>\>

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

[token/allowance.ts:83](https://github.com/ieigen/eigen_service/blob/760a065/src/token/allowance.ts#L83)

___

### updateOrAdd

▸ `Const` **updateOrAdd**(`network_id`, `token_address`, `user_address`, `swap_address`, `allowance`): `void`

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

[token/allowance.ts:99](https://github.com/ieigen/eigen_service/blob/760a065/src/token/allowance.ts#L99)

___

### get

▸ `Const` **get**(`network_id`, `token_address`, `user_address`, `swap_address`): `Promise`<`Model`<`any`, `any`\>\>

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

[token/allowance.ts:140](https://github.com/ieigen/eigen_service/blob/760a065/src/token/allowance.ts#L140)

___

### findAllAllowancesGreaterThanZero

▸ `Const` **findAllAllowancesGreaterThanZero**(`network_id`, `user_address`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `user_address` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[token/allowance.ts:146](https://github.com/ieigen/eigen_service/blob/760a065/src/token/allowance.ts#L146)

___

### get\_allowance

▸ `Const` **get_allowance**(`network`, `user_address`, `token_address`, `swap_address`): `void`

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

[token/allowance.ts:170](https://github.com/ieigen/eigen_service/blob/760a065/src/token/allowance.ts#L170)
