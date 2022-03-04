[](../README.md) / [Exports](../modules.md) / login

# Module: login

Provide metamask related login processes

## Table of contents

### Functions

- [getAuthMetamask](login.md#getauthmetamask)
- [postAuthMetamask](login.md#postauthmetamask)

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

[login/metamask.ts:38](https://github.com/ieigen/eigen_service/blob/760a065/src/login/metamask.ts#L38)

___

### postAuthMetamask

▸ **postAuthMetamask**(`req`, `res`): `Promise`<`void`\>

Verify the signature with the previous nonce, if success, response with
a UID and JWT

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `any` | the request information, including these fields:            1. address            2. email            3. signature |
| `res` | `any` | the response, if OK, it will redirect to a logged in page |

#### Returns

`Promise`<`void`\>

#### Defined in

[login/metamask.ts:69](https://github.com/ieigen/eigen_service/blob/760a065/src/login/metamask.ts#L69)
