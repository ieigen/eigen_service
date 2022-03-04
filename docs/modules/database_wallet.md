[](../README.md) / [Exports](../modules.md) / database\_wallet

# Module: database\_wallet

Wallet model definition

## Table of contents

### Variables

- [WALLET\_USER\_ADDRESS\_ROLE\_OWNER](database_wallet.md#wallet_user_address_role_owner)
- [WALLET\_USER\_ADDRESS\_ROLE\_SIGNER](database_wallet.md#wallet_user_address_role_signer)
- [WALLET\_STATUS\_MACHINE\_STATE\_CHECK](database_wallet.md#wallet_status_machine_state_check)
- [WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT](database_wallet.md#wallet_status_machine_state_transaction_next)

### Enumerations

- [SignerStatus](../enums/database_wallet.SignerStatus.md)
- [WalletStatus](../enums/database_wallet.WalletStatus.md)
- [WalletStatusTransactionResult](../enums/database_wallet.WalletStatusTransactionResult.md)

### Functions

- [add](database_wallet.md#add)
- [findAllAddresses](database_wallet.md#findalladdresses)
- [findOne](database_wallet.md#findone)
- [findByWalletId](database_wallet.md#findbywalletid)
- [findOwnerWalletById](database_wallet.md#findownerwalletbyid)
- [findAll](database_wallet.md#findall)
- [search](database_wallet.md#search)
- [isWalletBelongUser](database_wallet.md#iswalletbelonguser)
- [updateOwnerAddress](database_wallet.md#updateowneraddress)
- [updateOrAddByOwner](database_wallet.md#updateoraddbyowner)
- [updateOrAddBySigner](database_wallet.md#updateoraddbysigner)
- [remove](database_wallet.md#remove)

## Variables

### WALLET\_USER\_ADDRESS\_ROLE\_OWNER

• **WALLET\_USER\_ADDRESS\_ROLE\_OWNER**: ``0``

#### Defined in

[model/database_wallet.ts:25](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L25)

___

### WALLET\_USER\_ADDRESS\_ROLE\_SIGNER

• **WALLET\_USER\_ADDRESS\_ROLE\_SIGNER**: ``1``

#### Defined in

[model/database_wallet.ts:26](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L26)

___

### WALLET\_STATUS\_MACHINE\_STATE\_CHECK

• **WALLET\_STATUS\_MACHINE\_STATE\_CHECK**: `boolean`[][]

#### Defined in

[model/database_wallet.ts:61](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L61)

___

### WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT

• **WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT**: [`WalletStatus`](../enums/database_wallet.WalletStatus.md)[][]

#### Defined in

[model/database_wallet.ts:79](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L79)

## Functions

### add

▸ `Const` **add**(`user_id`, `name`, `wallet_address`, `address`, `role`, `status`, `wallet_status`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `name` | `any` |
| `wallet_address` | `any` |
| `address` | `any` |
| `role` | `any` |
| `status` | `any` |
| `wallet_status` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:136](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L136)

___

### findAllAddresses

▸ `Const` **findAllAddresses**(`user_id`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet.ts:156](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L156)

___

### findOne

▸ `Const` **findOne**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:166](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L166)

___

### findByWalletId

▸ `Const` **findByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:171](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L171)

___

### findOwnerWalletById

▸ `Const` **findOwnerWalletById**(`user_id`, `wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:180](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L180)

___

### findAll

▸ `Const` **findAll**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet.ts:191](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L191)

___

### search

▸ `Const` **search**(`dict`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet.ts:195](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L195)

___

### isWalletBelongUser

▸ `Const` **isWalletBelongUser**(`user_id`, `wallet_id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `wallet_id` | `any` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[model/database_wallet.ts:199](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L199)

___

### updateOwnerAddress

▸ `Const` **updateOwnerAddress**(`user_id`, `wallet_id`, `owner_address`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `wallet_id` | `any` |
| `owner_address` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_wallet.ts:211](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L211)

___

### updateOrAddByOwner

▸ `Const` **updateOrAddByOwner**(`user_id`, `wallet_address`, `signer_address`, `role`, `update_dict`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_id` | `any` |
| `wallet_address` | `any` |
| `signer_address` | `any` |
| `role` | `any` |
| `update_dict` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_wallet.ts:238](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L238)

___

### updateOrAddBySigner

▸ `Const` **updateOrAddBySigner**(`wallet_address`, `signer_address`, `update_dict`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_address` | `any` |
| `signer_address` | `any` |
| `update_dict` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_wallet.ts:298](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L298)

___

### remove

▸ `Const` **remove**(`wallet_address`, `signer_address`, `role`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_address` | `any` |
| `signer_address` | `any` |
| `role` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_wallet.ts:372](https://github.com/ieigen/eigen_service/blob/760a065/src/model/database_wallet.ts#L372)
