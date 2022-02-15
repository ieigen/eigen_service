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

▸ `Const` **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_friend_relationship.ts:84](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L84)

___

### request

▸ `Const` **request**(`requester_id`, `responder_id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:88](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L88)

___

### confirm

▸ `Const` **confirm**(`requester_id`, `responder_id`): ``false`` \| `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

``false`` \| `Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:255](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L255)

___

### reject

▸ `Const` **reject**(`requester_id`, `responder_id`): ``false`` \| `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

``false`` \| `Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:259](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L259)

___

### remove

▸ `Const` **remove**(`requester_id`, `responder_id`): ``false`` \| `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requester_id` | `any` |
| `responder_id` | `any` |

#### Returns

``false`` \| `Promise`<`any`\>

#### Defined in

[model/database_friend_relationship.ts:263](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L263)

___

### getFriendListByUserId

▸ `Const` **getFriendListByUserId**(`user_id`): `Promise`<`unknown`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`unknown`[]\>

#### Defined in

[model/database_friend_relationship.ts:354](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L354)

___

### getKnownByUserId

▸ `Const` **getKnownByUserId**(`user_id`): `Promise`<`Set`<`unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`Set`<`unknown`\>\>

#### Defined in

[model/database_friend_relationship.ts:387](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L387)

___

### getStatusByUserId

▸ `Const` **getStatusByUserId**(`user_id`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[model/database_friend_relationship.ts:424](https://github.com/ieigen/eigen_service/blob/b4bdd23/src/model/database_friend_relationship.ts#L424)
