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

▸ **require_env_variables**(`envVars`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `envVars` | `any` |

#### Returns

`void`

#### Defined in

[util.ts:10](https://github.com/ieigen/eigen_service/blob/b52d034/src/util.ts#L10)

___

### BaseResp

▸ **BaseResp**(`errno`, `message`, `data`): `Object`

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

[util.ts:19](https://github.com/ieigen/eigen_service/blob/b52d034/src/util.ts#L19)

___

### Succ

▸ **Succ**(`data`): `Object`

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

[util.ts:22](https://github.com/ieigen/eigen_service/blob/b52d034/src/util.ts#L22)

___

### Err

▸ **Err**(`errno`, `message`): `Object`

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

[util.ts:25](https://github.com/ieigen/eigen_service/blob/b52d034/src/util.ts#L25)

___

### has\_value

▸ **has_value**(`variable`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `any` |

#### Returns

`boolean`

#### Defined in

[util.ts:43](https://github.com/ieigen/eigen_service/blob/b52d034/src/util.ts#L43)

___

### check\_user\_id

▸ **check_user_id**(`req`, `user_id`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `any` |
| `user_id` | `any` |

#### Returns

`boolean`

#### Defined in

[util.ts:53](https://github.com/ieigen/eigen_service/blob/b52d034/src/util.ts#L53)
