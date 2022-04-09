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

## Variables

### WALLET\_USER\_ADDRESS\_ROLE\_OWNER

• `Const` **WALLET\_USER\_ADDRESS\_ROLE\_OWNER**: ``0``

#### Defined in

[model/database_wallet.ts:25](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L25)

___

### WALLET\_USER\_ADDRESS\_ROLE\_SIGNER

• `Const` **WALLET\_USER\_ADDRESS\_ROLE\_SIGNER**: ``1``

#### Defined in

[model/database_wallet.ts:26](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L26)

___

### WALLET\_STATUS\_MACHINE\_STATE\_CHECK

• `Const` **WALLET\_STATUS\_MACHINE\_STATE\_CHECK**: `boolean`[][]

#### Defined in

[model/database_wallet.ts:61](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L61)

___

### WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT

• `Const` **WALLET\_STATUS\_MACHINE\_STATE\_TRANSACTION\_NEXT**: [`WalletStatus`](../enums/database_wallet.WalletStatus.md)[][]

#### Defined in

[model/database_wallet.ts:79](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L79)

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

[model/database_wallet.ts:136](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L136)

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

[model/database_wallet.ts:156](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L156)

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

[model/database_wallet.ts:161](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L161)

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

[model/database_wallet.ts:170](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L170)

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

[model/database_wallet.ts:180](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L180)

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

[model/database_wallet.ts:184](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L184)

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

[model/database_wallet.ts:188](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L188)

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

[model/database_wallet.ts:209](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L209)

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

[model/database_wallet.ts:223](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L223)

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

[model/database_wallet.ts:285](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L285)

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

[model/database_wallet.ts:361](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_wallet.ts#L361)
