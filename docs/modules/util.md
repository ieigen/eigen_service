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

[util.ts:26](https://github.com/ieigen/eigen_service/blob/1208a86/src/util.ts#L26)

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

[util.ts:35](https://github.com/ieigen/eigen_service/blob/1208a86/src/util.ts#L35)

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

[util.ts:38](https://github.com/ieigen/eigen_service/blob/1208a86/src/util.ts#L38)

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

[util.ts:41](https://github.com/ieigen/eigen_service/blob/1208a86/src/util.ts#L41)

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

[util.ts:59](https://github.com/ieigen/eigen_service/blob/1208a86/src/util.ts#L59)

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

[util.ts:69](https://github.com/ieigen/eigen_service/blob/1208a86/src/util.ts#L69)
