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

[model/database_friend_relationship.ts:90](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L90)

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

[model/database_friend_relationship.ts:94](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L94)

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

[model/database_friend_relationship.ts:261](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L261)

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

[model/database_friend_relationship.ts:265](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L265)

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

[model/database_friend_relationship.ts:269](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L269)

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

[model/database_friend_relationship.ts:360](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L360)

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

[model/database_friend_relationship.ts:393](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L393)

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

[model/database_friend_relationship.ts:430](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_friend_relationship.ts#L430)
