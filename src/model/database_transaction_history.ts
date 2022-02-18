// database_transaction_history.ts
/**
 * Transaction history model definition
 *
 * @module database_transaction_history
 */

import { Sequelize, Op, DataTypes, Order } from "sequelize";
import consola from "consola";

const getOrder = (order): Order => {
  if (order === "1") return [["updatedAt", "DESC"]];
  return [];
};

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_transaction_history.sqlite",
});

/**
 * The kind of signature operation.
 *
 * @enum
 */
export enum TransactionStatus {
  Failed = -1,
  Sent = 0,
  Success = 1,
  Creating = 2,
}

const thdb = sequelize.define("transaction_history_st", {
  txid: {
    type: DataTypes.CITEXT,
    allowNull: false,
    unique: true,
  },
  network_id: DataTypes.STRING(64),
  from: DataTypes.CITEXT,
  from_type: DataTypes.INTEGER,
  to_network_id: DataTypes.STRING(64), // Could be empty since L1 -> L1 or L2 -> L2 should be occured on the same network
  to: DataTypes.CITEXT,
  name: DataTypes.STRING,
  value: DataTypes.INTEGER,
  type: DataTypes.INTEGER,
  block_num: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
  sub_txid: DataTypes.CITEXT,
  operation: DataTypes.CITEXT, // Transaction operation (e.g., send, exchange, approve, etc.)
});

export const TX_TYPE_L1ToL1 = 0x0;
export const TX_TYPE_L1ToL2 = 0x1;
export const TX_TYPE_L2ToL1 = 0x2;
export const TX_TYPE_L2ToL2 = 0x3;

export const FROM_TYPE_ACCOUNT = 0x0;
export const FROM_TYPE_WALLET = 0x1;

sequelize
  .sync()
  .then(function () {
    return thdb.create({
      txid: "_txid",
      network_id: "1",
      from: "0xID",
      from_type: FROM_TYPE_ACCOUNT,
      to_network_id: "1",
      to: "0xID",
      value: 0,
      type: TX_TYPE_L1ToL1,
      block_num: 0,
      name: "ETH",
      status: TransactionStatus.Success,
      sub_txid: "",
      operation: "send",
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    thdb.destroy({ where: { txid: row.txid } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (dict) {
  return thdb.create({
    txid: dict.txid,
    network_id: dict.network_id,
    from: dict.from,
    from_type: dict.from_type || FROM_TYPE_ACCOUNT,
    to_network_id: dict.network_id,
    to: dict.to,
    value: dict.value,
    type: dict.type,
    name: dict.name || "ETH",
    block_num: dict.block_num || -1, // `block_num` can be empty when `send` is called
    status: dict.status,
    sub_txid: dict.sub_txid || "",
    operation: dict.operation,
  });
};

const getByTxid = function (txid) {
  return thdb.findOne({ where: { txid } });
};

const delByTxid = (txid) => {
  return thdb.destroy({ where: { txid: txid } });
};

const search = async function (filter_dict, page, page_size, order) {
  consola.log("Search filter: ", filter_dict);
  // Seq will throw for all undefined keys in where options.  https://sequelize.org/v5/manual/upgrade-to-v5.html

  if (page) {
    consola.log("page = ", page);
    consola.log("page_size = ", page_size);

    const { count, rows } = await thdb.findAndCountAll({
      where: filter_dict,
      order: getOrder(order),
      limit: page_size,
      offset: (page - 1) * page_size,
      raw: true,
    });
    consola.log("count = ", count);
    consola.log("rows = ", rows);
    const total_page = Math.ceil(count / page_size);
    return {
      transactions: rows,
      total_page,
    };
  } else {
    const list = await thdb.findAll({
      where: filter_dict,
      order: getOrder(order),
      raw: true,
    });
    return {
      transactions: list,
      total_page: list.length,
    };
  }
};

// select * from thx where ((from in as_owners) or (from in as_signers and status == creating)) and other filters
const search_with_multisig = async (
  as_owners: string[],
  as_signers: string[],
  other_filters,
  page,
  page_size,
  order
) => {
  const { count, rows } = await thdb.findAndCountAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ from: { [Op.in]: as_owners } }, other_filters],
        },
        {
          [Op.and]: [
            { from: { [Op.in]: as_signers } },
            { status: TransactionStatus.Creating },
            other_filters,
          ],
        },
      ],
    },
    limit: page_size,
    order: getOrder(order),
    offset: (page - 1) * page_size,
    raw: true,
  });
  const total_page = Math.ceil(count / page_size);
  return {
    transactions: rows,
    total_page,
  };
};

const search_both_sizes = async function (filter_dict, page, page_size, order) {
  consola.log("Search both sizes filter: ", filter_dict);
  const address = filter_dict.address;
  delete filter_dict.address;
  const address_filter = {
    where: {
      ...filter_dict,
      [Op.or]: [
        {
          from: address,
        },
        {
          to: address,
        },
      ],
    },
  };

  if (page) {
    consola.log("page = ", page);
    consola.log("page_size = ", page_size);

    consola.log("Reverse order is enabled");

    const { count, rows } = await thdb.findAndCountAll({
      ...address_filter,
      order: getOrder(order),
      limit: page_size,
      offset: (page - 1) * page_size,
      raw: true,
    });
    consola.log("count = ", count);
    consola.log("rows = ", rows);
    const total_page = Math.ceil(count / page_size);
    return {
      transactions: rows,
      total_page,
    };
  } else {
    let filter: any = address_filter;

    filter = {
      ...address_filter,
      order: getOrder(order),
    };

    return await thdb.findAll(filter);
  }
};

const findAll = function () {
  return thdb.findAll();
};

const updateOrAdd = function (txid, update_dict) {
  thdb.findOne({ where: { txid } }).then(function (row: any) {
    consola.log("find: ", row);
    if (row === null) {
      add(update_dict);
      return true;
    }
    const concatenated = { ...row["dataValues"], ...update_dict };
    consola.log("Concatenated: ", concatenated);

    return row
      .update(concatenated)
      .then(function (result) {
        consola.log("Update success: " + JSON.stringify(result));
        return true;
      })
      .catch(function (err) {
        consola.log("Update error: " + err);
        return false;
      });
  });
};

const account_count_l2 = function () {
  return (async () => {
    const l2_to_l1: any = await thdb.findAll({
      attributes: [["from", "account"]],
      where: {
        type: TX_TYPE_L2ToL1,
      },
      raw: true,
    });
    consola.log(l2_to_l1);
    const accounts = new Set();
    for (let i = 0; i < l2_to_l1.length; i++) {
      accounts.add(l2_to_l1[i].account);
    }

    const l2_to_l2: any = await thdb.findAll({
      attributes: [
        ["from", "account"],
        ["to", "account"],
      ],
      where: {
        type: TX_TYPE_L2ToL2,
      },
      raw: true,
    });

    consola.log(l2_to_l2);
    for (let i = 0; i < l2_to_l2.length; i++) {
      accounts.add(l2_to_l2[i].account);
    }

    return accounts.size;
  })();
};

const transaction_count_l2 = function () {
  return thdb.count({
    where: {
      type: {
        [Op.or]: [TX_TYPE_L2ToL1, TX_TYPE_L2ToL2],
      },
    },
  });
};

export {
  account_count_l2,
  transaction_count_l2,
  updateOrAdd,
  add,
  search,
  getByTxid,
  findAll,
  delByTxid,
  search_both_sizes,
  search_with_multisig,
};
