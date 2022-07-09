// tx.ts
/**
 * tx definition
 *
 * @module database
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, DataTypes } from "sequelize";
import consola from "consola";
import { parse } from "dotenv";
const TXS_PER_SNARK = 4;

export enum tx_status {
  NewTx = 0,
  ConfirmedTx = 1,
}

export enum tx_withdraw_status {
  WithdrawPending = 0,
  WithdrawFinish = 1,
}

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/zkzrutx_db.sqlite",
});

const l2txdb = sequelize.define("tx_st", {
  tx_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }, 

  network_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },

  from_index: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  
  senderPubkey: {
      type: DataTypes.CITEXT,
      allowNull: false,
  },

  r8x: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  r8y: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  s: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  receiverPubkey: {
      type: DataTypes.CITEXT,
      allowNull: false
  },

  tokenTypeFrom: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },

  amount: {
    allowNull: false,
    type: DataTypes.STRING,
  },

  nonce: {
      allowNull: false,
      type: DataTypes.BIGINT,
  },

  // 0: new, 1, confirmed
  status: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  recipient: {
    allowNull: true,
    type: DataTypes.STRING,
  },

  withdraw_r8x: {
    allowNull: true,
    type: DataTypes.STRING,
  },

  withdraw_r8y: {
    allowNull: true,
    type: DataTypes.STRING,
  },

  withdraw_s: {
    allowNull: true,
    type: DataTypes.STRING,
  },

  withdraw_msg: {
    allowNull: true,
    type: DataTypes.STRING,
  },

  // withdraw finish, status: 1
  withdraw_status: {
    allowNull: true,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  block_number: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },

  // current tx index in block
  block_index: {
    allowNull: true,
    type: DataTypes.INTEGER,
  }

});

sequelize
  .sync()

const add = async function (
    network_id, 
    from_index, 
    senderPubkey, 
    r8x, 
    r8y, 
    s, 
    receiverPubkey, 
    tokenTypeFrom, 
    amount, 
    nonce, 
    status, 
    recipient,
    withdraw_r8x, 
    withdraw_r8y, 
    withdraw_s, 
    withdraw_msg
  ) {
  const res = await l2txdb.create({
    network_id,
    from_index,
    senderPubkey,
    r8x,
    r8y,
    s,
    receiverPubkey,
    tokenTypeFrom,
    amount,
    nonce,
    status,
    recipient,
    withdraw_r8x,
    withdraw_r8y,
    withdraw_s,
    withdraw_msg
  });
  return res;
};

const findOne = async function (filter_dict) {
  const res = await l2txdb.findOne({ where: filter_dict });
  return res;
};

const findAll = async function (dict) {
  const res =  l2txdb.findAll({ where: dict });
  return res;
};

const findOneBatchPendingTXs = async function () {
  const res = await l2txdb.findAll({ 
    where: { status: 0 },
    limit: TXS_PER_SNARK,
    order: [ [ 'createdAt', 'ASC' ]],
  });
  return res;
}

const count = async function (dict) {
  const amount = l2txdb.count({ where: dict });
  return amount
}

const currentTxID = async () => {
  const last = await l2txdb.findOne({
      where: { },
      order: [ [ 'createdAt', 'DESC' ]],
  });
  if (last == null) {
    return 0;
  }
  return last["tx_id"]
}

const emptyTX = () => {
    return {
        "network_id": 0,
        "senderPubkey": "",
        "receiverPubkey": "",
        "index": 0,
        "amount": 0,
        "nonce": 0,
        "tokenTypeFrom": 0
    }
}

const update = (filter_dict, value_dict) => {
    return l2txdb
    .update(
        value_dict,
        {
            where: filter_dict,
        }
    )
    .then(function (result: any) {
        consola.log("Update all tx status result: ", result);
        return true;
    })
}

const findAllOrderByCreateTime = async function (dict) {
  const res =  l2txdb.findAll({ 
    where: dict,
    order: [ [ 'createdAt', 'ASC' ]]});

  return res;
};

export { 
  add,
  findOne, 
  findAll, 
  findOneBatchPendingTXs, 
  count, 
  currentTxID, 
  emptyTX, 
  update, 
  findAllOrderByCreateTime
};
