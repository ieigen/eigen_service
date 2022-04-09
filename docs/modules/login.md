[](../README.md) / [Exports](../modules.md) / login

# Module: login

Provide metamask related login processes

## Table of contents

### Functions

- [getAuthMetamask](login.md#getauthmetamask)
- [postAuthMetamask](login.md#postauthmetamask)
- [postUserAssociation](login.md#postuserassociation)

## Functions

### getAuthMetamask

▸ **getAuthMetamask**(`req`, `res`): `Promise`<`any`\>

Get a nonce in order to login with metamask

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `any` | the request information, including these fields:            1. address |
| `res` | `any` | the response, if OK, it is a nonce (a 32-length base64) |

#### Returns

`Promise`<`any`\>

#### Defined in

[login/metamask.ts:39](https://github.com/ieigen/eigen_service/blob/b52d034/src/login/metamask.ts#L39)

___

### postAuthMetamask

▸ **postAuthMetamask**(`req`, `res`): `Promise`<`any`\>

Verify the signature with the previous nonce, if success, response with
a UID and JWT

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `any` | the request information, including these fields:            1. address            2. email            3. signature |
| `res` | `any` | the response, if OK, it will redirect to a logged in page |

#### Returns

`Promise`<`any`\>

#### Defined in

[login/metamask.ts:70](https://github.com/ieigen/eigen_service/blob/b52d034/src/login/metamask.ts#L70)

___

### postUserAssociation

▸ **postUserAssociation**(`req`, `res`): `Promise`<`any`\>

Association between fake_email and Google email

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `any` | the request information, including these fields:            1. fake_email            2. email |
| `res` | `any` | the response, return true if success |

#### Returns

`Promise`<`any`\>

#### Defined in

[login/metamask.ts:202](https://github.com/ieigen/eigen_service/blob/b52d034/src/login/metamask.ts#L202)
