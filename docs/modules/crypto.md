[](../README.md) / [Exports](../modules.md) / crypto

# Module: crypto

Provides secret share functions

## Table of contents

### Enumerations

- [SecLevel](../enums/crypto.SecLevel.md)

### Functions

- [generate\_key](crypto.md#generate_key)
- [generate\_mnemonic](crypto.md#generate_mnemonic)
- [split](crypto.md#split)
- [combine](crypto.md#combine)

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

[crypto/secretshare.ts:74](https://github.com/ieigen/eigen_service/blob/1208a86/src/crypto/secretshare.ts#L74)

___

### generate\_mnemonic

▸ **generate_mnemonic**(`typ`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `typ` | [`SecLevel`](../enums/crypto.SecLevel.md) |

#### Returns

`string`

#### Defined in

[crypto/secretshare.ts:89](https://github.com/ieigen/eigen_service/blob/1208a86/src/crypto/secretshare.ts#L89)

___

### split

▸ **split**(`secret`, `level`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `secret` | `string` |
| `level` | [`SecLevel`](../enums/crypto.SecLevel.md) |

#### Returns

`string`[]

#### Defined in

[crypto/secretshare.ts:112](https://github.com/ieigen/eigen_service/blob/1208a86/src/crypto/secretshare.ts#L112)

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

[crypto/secretshare.ts:126](https://github.com/ieigen/eigen_service/blob/1208a86/src/crypto/secretshare.ts#L126)
