[](../README.md) / [Exports](../modules.md) / login

# Module: login

Provides secret share functions

## Table of contents

### Enumerations

- [SecLevel](../enums/login.SecLevel.md)

### Functions

- [generate\_key](login.md#generate_key)
- [generate\_mnemonic](login.md#generate_mnemonic)
- [split](login.md#split)
- [combine](login.md#combine)

## Functions

### generate\_key

▸ **generate_key**(`options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `any` |

#### Returns

`string`

#### Defined in

[crypto/secretshare.ts:59](https://github.com/ieigen/eigen_service/blob/5c9c266/src/crypto/secretshare.ts#L59)

___

### generate\_mnemonic

▸ **generate_mnemonic**(`typ`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `typ` | [`SecLevel`](../enums/login.SecLevel.md) |

#### Returns

`string`

#### Defined in

[crypto/secretshare.ts:74](https://github.com/ieigen/eigen_service/blob/5c9c266/src/crypto/secretshare.ts#L74)

___

### split

▸ **split**(`secret`, `level`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `secret` | `string` |
| `level` | [`SecLevel`](../enums/login.SecLevel.md) |

#### Returns

`string`[]

#### Defined in

[crypto/secretshare.ts:97](https://github.com/ieigen/eigen_service/blob/5c9c266/src/crypto/secretshare.ts#L97)

___

### combine

▸ **combine**(`shares`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `shares` | `string`[] |

#### Returns

`string`

#### Defined in

[crypto/secretshare.ts:111](https://github.com/ieigen/eigen_service/blob/5c9c266/src/crypto/secretshare.ts#L111)
