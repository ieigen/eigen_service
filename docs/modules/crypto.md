[](../README.md) / [Exports](../modules.md) / crypto

# Module: crypto

Provides ecies related utility functions

## Table of contents

### Functions

- [aes\_enc](crypto.md#aes_enc)
- [aes\_dec](crypto.md#aes_dec)
- [encrypt](crypto.md#encrypt)
- [decrypt](crypto.md#decrypt)

## Functions

### aes\_enc

▸ **aes_enc**(`cypherName`, `iv`, `key`, `plaintext`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cypherName` | `any` |
| `iv` | `any` |
| `key` | `any` |
| `plaintext` | `any` |

#### Returns

`any`

#### Defined in

[crypto/ecies.ts:23](https://github.com/ieigen/eigen_service/blob/760a065/src/crypto/ecies.ts#L23)

___

### aes\_dec

▸ **aes_dec**(`cypherName`, `key`, `cipherText`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cypherName` | `any` |
| `key` | `any` |
| `cipherText` | `any` |

#### Returns

`string`

#### Defined in

[crypto/ecies.ts:31](https://github.com/ieigen/eigen_service/blob/760a065/src/crypto/ecies.ts#L31)

___

### encrypt

▸ `Const` **encrypt**(`publicKey`, `message`, `options`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `any` |
| `message` | `any` |
| `options` | `any` |

#### Returns

`any`

#### Defined in

[crypto/ecies.ts:97](https://github.com/ieigen/eigen_service/blob/760a065/src/crypto/ecies.ts#L97)

___

### decrypt

▸ `Const` **decrypt**(`keyPair`, `message`, `options`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPair` | `any` |
| `message` | `any` |
| `options` | `any` |

#### Returns

`string`

#### Defined in

[crypto/ecies.ts:145](https://github.com/ieigen/eigen_service/blob/760a065/src/crypto/ecies.ts#L145)
