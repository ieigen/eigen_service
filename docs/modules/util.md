[](../README.md) / [Exports](../modules.md) / util

# Module: util

Provide some useful utility functions

## Table of contents

### Functions

- [require\_env\_variables](util.md#require_env_variables)
- [BaseResp](util.md#baseresp)
- [Succ](util.md#succ)
- [Err](util.md#err)
- [has\_value](util.md#has_value)
- [check\_user\_id](util.md#check_user_id)

### Enumerations

- [ErrCode](../enums/util.ErrCode.md)

## Functions

### require\_env\_variables

▸ `Const` **require_env_variables**(`envVars`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `envVars` | `any` |

#### Returns

`void`

#### Defined in

[util.ts:10](https://github.com/ieigen/eigen_service/blob/760a065/src/util.ts#L10)

___

### BaseResp

▸ `Const` **BaseResp**(`errno`, `message`, `data`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `errno` | `any` |
| `message` | `any` |
| `data` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `errno` | `any` |
| `message` | `any` |
| `data` | `any` |

#### Defined in

[util.ts:19](https://github.com/ieigen/eigen_service/blob/760a065/src/util.ts#L19)

___

### Succ

▸ `Const` **Succ**(`data`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `errno` | `any` |
| `message` | `any` |
| `data` | `any` |

#### Defined in

[util.ts:22](https://github.com/ieigen/eigen_service/blob/760a065/src/util.ts#L22)

___

### Err

▸ `Const` **Err**(`errno`, `message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `errno` | `any` |
| `message` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `errno` | `any` |
| `message` | `any` |
| `data` | `any` |

#### Defined in

[util.ts:25](https://github.com/ieigen/eigen_service/blob/760a065/src/util.ts#L25)

___

### has\_value

▸ `Const` **has_value**(`variable`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `any` |

#### Returns

`boolean`

#### Defined in

[util.ts:42](https://github.com/ieigen/eigen_service/blob/760a065/src/util.ts#L42)

___

### check\_user\_id

▸ `Const` **check_user_id**(`req`, `user_id`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `user_id` | `any` |

#### Returns

`boolean`

#### Defined in

[util.ts:52](https://github.com/ieigen/eigen_service/blob/760a065/src/util.ts#L52)
