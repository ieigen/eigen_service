[](../README.md) / [Exports](../modules.md) / database\_friend\_relationship

# Module: database\_friend\_relationship

Friend relationship model definition

## Table of contents

### Functions

- [findAll](database_friend_relationship.md#findall)
- [request](database_friend_relationship.md#request)
- [confirm](database_friend_relationship.md#confirm)
- [reject](database_friend_relationship.md#reject)
- [remove](database_friend_relationship.md#remove)
- [getFriendListByUserId](database_friend_relationship.md#getfriendlistbyuserid)
- [getKnownByUserId](database_friend_relationship.md#getknownbyuserid)
- [getStatusByUserId](database_friend_relationship.md#getstatusbyuserid)

## Functions

### findAll

▸ **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_friend_relationship.ts:105](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L105)

___

### request

▸ **request**(`requester_id`, `responder_id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:109](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L109)

___

### confirm

▸ **confirm**(`requester_id`, `responder_id`): ``false`` \| `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

``false`` \| `Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:276](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L276)

___

### reject

▸ **reject**(`requester_id`, `responder_id`): ``false`` \| `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

``false`` \| `Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:280](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L280)

___

### remove

▸ **remove**(`requester_id`, `responder_id`): ``false`` \| `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

``false`` \| `Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:284](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L284)

___

### getFriendListByUserId

▸ **getFriendListByUserId**(`user_id`): `Promise`<`unknown`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`unknown`[]\>

#### Defined in

[model/database_friend_relationship.ts:375](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L375)

___

### getKnownByUserId

▸ **getKnownByUserId**(`user_id`): `Promise`<`Set`<`unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`Set`<`unknown`\>\>

#### Defined in

[model/database_friend_relationship.ts:408](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L408)

___

### getStatusByUserId

▸ **getStatusByUserId**(`user_id`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[model/database_friend_relationship.ts:445](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_friend_relationship.ts#L445)
