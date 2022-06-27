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
- [findOne](database_wallet.md#findone)
- [findByWalletId](database_wallet.md#findbywalletid)
- [findOwnerWalletById](database_wallet.md#findownerwalletbyid)
- [findAll](database_wallet.md#findall)
- [search](database_wallet.md#search)
- [updateOwnerAddress](database_wallet.md#updateowneraddress)
- [updateAllSignersStatus](database_wallet.md#updateallsignersstatus)
- [updateOrAddByOwner](database_wallet.md#updateoraddbyowner)
- [updateOrAddBySigner](database_wallet.md#updateoraddbysigner)
- [remove](database_wallet.md#remove)
- [updateOrAdd](database_wallet.md#updateoradd)

## Variables

### WALLET\_USER\_ADDRESS\_ROLE\_OWNER

• `Const` **WALLET\_USER\_ADDRESS\_ROLE\_OWNER**: ``0``

#### Defined in

[model/database_wallet.ts:41](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L41)

___

### WALLET\_USER\_ADDRESS\_ROLE\_SIGNER

• `Const` **WALLET\_USER\_ADDRESS\_ROLE\_SIGNER**: ``1``

#### Defined in

[model/database_wallet.ts:42](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L42)

___

### WALLET\_STATUS\_MACHINE\_STATE\_CHECK

• `Const` **WALLET\_STATUS\_MACHINE\_STATE\_CHECK**: `boolean`[][]

#### Defined in

[model/database_wallet.ts:77](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L77)

___

### WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT

• `Const` **WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT**: [`WalletStatus`](../enums/database_wallet.WalletStatus.md)[][]

#### Defined in

[model/database_wallet.ts:95](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L95)

## Functions

### add

▸ **add**(`network_id`, `name`, `wallet_address`, `address`, `role`, `status`, `wallet_status`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `name` | `any` |
| `wallet_address` | `any` |
| `address` | `any` |
| `role` | `any` |
| `status` | `any` |
| `wallet_status` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:152](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L152)

___

### findOne

▸ **findOne**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:172](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L172)

___

### findByWalletId

▸ **findByWalletId**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:177](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L177)

___

### findOwnerWalletById

▸ **findOwnerWalletById**(`wallet_id`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_wallet.ts:186](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L186)

___

### findAll

▸ **findAll**(`filter_dict`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter_dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet.ts:196](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L196)

___

### search

▸ **search**(`dict`): `Promise`<`Model`<`any`, `any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dict` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_wallet.ts:200](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L200)

___

### updateOwnerAddress

▸ **updateOwnerAddress**(`wallet_id`, `owner_address`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_id` | `any` |
| `owner_address` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_wallet.ts:204](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L204)

___

### updateAllSignersStatus

▸ **updateAllSignersStatus**(`wallet_address`, `status`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet_address` | `any` |
| `status` | `any` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[model/database_wallet.ts:225](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L225)

___

### updateOrAddByOwner

▸ **updateOrAddByOwner**(`network_id`, `wallet_address`, `signer_address`, `role`, `update_dict`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `wallet_address` | `any` |
| `signer_address` | `any` |
| `role` | `any` |
| `update_dict` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_wallet.ts:239](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L239)

___

### updateOrAddBySigner

▸ **updateOrAddBySigner**(`network_id`, `wallet_address`, `signer_address`, `update_dict`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `wallet_address` | `any` |
| `signer_address` | `any` |
| `update_dict` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_wallet.ts:301](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L301)

___

### remove

▸ **remove**(`network_id`, `wallet_address`, `signer_address`, `role`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `wallet_address` | `any` |
| `signer_address` | `any` |
| `role` | `any` |

#### Returns

`Promise`<`number`\>

#### Defined in

[model/database_wallet.ts:377](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L377)

___

### updateOrAdd

▸ **updateOrAdd**(`network_id`, `name`, `wallet_address`, `address`, `role`, `status`, `wallet_status`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network_id` | `any` |
| `name` | `any` |
| `wallet_address` | `any` |
| `address` | `any` |
| `role` | `any` |
| `status` | `any` |
| `wallet_status` | `any` |

#### Returns

`void`

#### Defined in

[model/database_wallet.ts:383](https://github.com/ieigen/eigen_service/blob/1208a86/src/model/database_wallet.ts#L383)
