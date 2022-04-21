[](../README.md) / [Exports](../modules.md) / database\_id\_map

# Module: database\_id\_map

User information model definition

## Table of contents

### Functions

- [add](database_id_map.md#add)
- [findAll](database_id_map.md#findall)
- [findByValueAndKind](database_id_map.md#findbyvalueandkind)

## Functions

### add

▸ **add**(`user_info`): `Promise`<`Model`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user_info` | `any` |

#### Returns

`Promise`<`Model`<`any`, `any`\>\>

#### Defined in

[model/database_id_map.ts:53](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id_map.ts#L53)

___

### findAll

▸ **findAll**(): `Promise`<`Model`<`any`, `any`\>[]\>

#### Returns

`Promise`<`Model`<`any`, `any`\>[]\>

#### Defined in

[model/database_id_map.ts:57](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id_map.ts#L57)

___

### findByValueAndKind

▸ **findByValueAndKind**(`value`, `kind`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `kind` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[model/database_id_map.ts:61](https://github.com/ieigen/eigen_service/blob/b52d034/src/model/database_id_map.ts#L61)
