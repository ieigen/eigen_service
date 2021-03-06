// database_friend_relationship.ts
/**
 * Friend relationship model definition
 *
 * @module database_friend_relationship
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, Op, DataTypes } from "sequelize";
import consola from "consola";

const sequelize = new Sequelize({
  dialect: "sqlite",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_friend_relationship.sqlite",
});

const NOT_FRIENDS = 0x0;
const PENDING_FIRST_SECOND = 0x1;
const PENDING_SECOND_FIRST = 0x2;
const FRIENDS = 0x3;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BLOCK_FIRST_SECOND = 0x4;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BLOCK_SECOND_FIRST = 0x5;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BLOCK_BOTH = 0x6;

const FRIEND_LIST_STATUS_MUTUAL = 0x1;
const FRIEND_LIST_STATUS_WAITING = 0x2;
const FRIEND_LIST_STATUS_CONFIRMING = 0x3;

const frdb = sequelize.define("friend_relationship_st", {
  user_first_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  user_second_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  type: DataTypes.INTEGER,
});

sequelize
  .sync()
  .then(function () {
    return frdb.create({
      user_first_id: 1,
      user_second_id: 2,
      type: NOT_FRIENDS,
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    frdb.destroy({
      where: {
        user_first_id: row.user_first_id,
        user_second_id: row.user_second_id,
      },
    });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const getRelationship = function (user1_id, user2_id) {
  if (user1_id > user2_id) {
    [user1_id, user2_id] = [user2_id, user1_id];
  }

  return frdb.findOne({
    where: { user_first_id: user1_id, user_second_id: user2_id },
  });
};

const findAll = function () {
  return frdb.findAll();
};

const request = function (requester_id, responder_id) {
  return getRelationship(requester_id, responder_id)
    .then(function (row: any) {
      if (row === null) {
        if (requester_id < responder_id) {
          frdb.create({
            user_first_id: requester_id,
            user_second_id: responder_id,
            type: PENDING_FIRST_SECOND,
          });
          return true;
        } else if (requester_id > responder_id) {
          frdb.create({
            user_first_id: responder_id,
            user_second_id: requester_id,
            type: PENDING_SECOND_FIRST,
          });
          return true;
        } else {
          consola.log("We can't make friends with ourselves.");
          return false;
        }
      } else {
        if (row.type === NOT_FRIENDS) {
          consola.log(
            "They were friends: ",
            requester_id,
            " and ",
            responder_id
          );

          if (requester_id < responder_id) {
            return row
              .update({
                type: PENDING_FIRST_SECOND,
              })
              .then(function (result) {
                consola.log("Update success: " + result);
                return true;
              })
              .catch(function (err) {
                consola.log("Update error: " + err);
                return false;
              });
          } else if (requester_id > responder_id) {
            return row
              .update({
                type: PENDING_SECOND_FIRST,
              })
              .then(function (result) {
                consola.log("Update success: " + result);
                return true;
              })
              .catch(function (err) {
                consola.log("Update error: " + err);
                return false;
              });
          } else {
            consola.log("We can't make friends with ourselves.");
            return false;
          }
        } else {
          consola.log(
            "Pending friend request or already friend: ",
            requester_id,
            " and ",
            responder_id
          );
          // Just return true, now we allow duplicate request
          return true;
        }
      }
    })
    .catch(function (err) {
      consola.log("Unable to connect to the database:", err);
    });
};

const change_pending_status = function (requester_id, responder_id, status) {
  if (requester_id < responder_id) {
    return frdb
      .findOne({
        where: { user_first_id: requester_id, user_second_id: responder_id },
      })
      .then(function (row: any) {
        if (row === null) {
          consola.log(
            "User: ",
            requester_id,
            " has not sent request to ",
            responder_id
          );
          return false;
        }

        if (row.type === PENDING_FIRST_SECOND) {
          return row
            .update({
              type: status,
            })
            .then(function (result) {
              consola.log("Update success: " + result);
              return true;
            })
            .catch(function (err) {
              consola.log("Update error: " + err);
              return false;
            });
        } else {
          consola.log(
            "User: ",
            requester_id,
            " has not sent request to ",
            responder_id,
            " and the relationship between them is ",
            row.type
          );
          return false;
        }
      });
  } else if (requester_id > responder_id) {
    return frdb
      .findOne({
        where: { user_first_id: responder_id, user_second_id: requester_id },
      })
      .then(function (row: any) {
        if (row === null) {
          consola.log(
            "User: ",
            requester_id,
            " has not sent request to ",
            responder_id
          );
          return false;
        }

        if (row.type === PENDING_SECOND_FIRST) {
          return row
            .update({
              type: status,
            })
            .then(function (result) {
              consola.log("Update success: " + result);
              return true;
            })
            .catch(function (err) {
              consola.log("Update error: " + err);
              return false;
            });
        } else {
          consola.log(
            "User: ",
            requester_id,
            " has not sent request to ",
            responder_id,
            " and the relationship between them is ",
            row.type
          );
          return false;
        }
      });
  } else {
    // Do nothing
    return false;
  }
};

const confirm = function (requester_id, responder_id) {
  return change_pending_status(requester_id, responder_id, FRIENDS);
};

const reject = function (requester_id, responder_id) {
  return change_pending_status(requester_id, responder_id, NOT_FRIENDS);
};

const remove = function (requester_id, responder_id) {
  if (requester_id < responder_id) {
    return frdb
      .findOne({
        where: { user_first_id: requester_id, user_second_id: responder_id },
      })
      .then(function (row: any) {
        if (row === null) {
          consola.log(
            "User: ",
            requester_id,
            " has not sent request to ",
            responder_id
          );
          return false;
        }

        if (row.type === FRIENDS) {
          return row
            .update({
              type: NOT_FRIENDS,
            })
            .then(function (result) {
              consola.log("Update success: " + result);
              return true;
            })
            .catch(function (err) {
              consola.log("Update error: " + err);
              return false;
            });
        } else {
          consola.log(
            "User: ",
            requester_id,
            " and ",
            responder_id,
            " are not frinds, the relationship between them is ",
            row.type
          );
          return false;
        }
      });
  } else if (requester_id > responder_id) {
    return frdb
      .findOne({
        where: { user_first_id: responder_id, user_second_id: requester_id },
      })
      .then(function (row: any) {
        if (row === null) {
          consola.log(
            "User: ",
            requester_id,
            " has not sent request to ",
            responder_id
          );
          return false;
        }

        if (row.type === FRIENDS) {
          return row
            .update({
              type: NOT_FRIENDS,
            })
            .then(function (result) {
              consola.log("Update success: " + result);
              return true;
            })
            .catch(function (err) {
              consola.log("Update error: " + err);
              return false;
            });
        } else {
          consola.log(
            "User: ",
            requester_id,
            " and ",
            responder_id,
            " are not frinds, the relationship between them is ",
            row.type
          );
          return false;
        }
      });
  } else {
    // Do nothing
    return false;
  }
};

// TODO: Add functions to block user

const getFriendListByUserId = function (user_id) {
  return (async (user_id) => {
    const first: any = await frdb.findAll({
      attributes: [["user_second_id", "user_id"]],
      where: {
        user_first_id: user_id,
        type: FRIENDS,
      },
      raw: true,
    });
    consola.log("Friends on first position: ", first);
    const friends = new Set();
    for (let i = 0; i < first.length; i++) {
      friends.add(first[i].user_id);
    }

    const second: any = await frdb.findAll({
      attributes: [["user_first_id", "user_id"]],
      where: {
        user_second_id: user_id,
        type: FRIENDS,
      },
      raw: true,
    });
    consola.log("Friends on second position: ", second);
    for (let i = 0; i < second.length; i++) {
      friends.add(second[i].user_id);
    }

    return Array.from(friends);
  })(user_id);
};

const getKnownByUserId = function (user_id) {
  return (async (user_id) => {
    const first: any = await frdb.findAll({
      attributes: [["user_second_id", "user_id"]],
      where: {
        user_first_id: user_id,
        type: {
          [Op.or]: [FRIENDS, PENDING_FIRST_SECOND, PENDING_SECOND_FIRST],
        },
      },
      raw: true,
    });
    consola.log("Known persons on first position: ", first);
    const persons = new Set();
    for (let i = 0; i < first.length; i++) {
      persons.add(first[i].user_id);
    }

    const second: any = await frdb.findAll({
      attributes: [["user_first_id", "user_id"]],
      where: {
        user_second_id: user_id,
        type: {
          [Op.or]: [FRIENDS, PENDING_FIRST_SECOND, PENDING_SECOND_FIRST],
        },
      },
      raw: true,
    });
    consola.log("Known persons on second position: ", second);
    for (let i = 0; i < second.length; i++) {
      persons.add(second[i].user_id);
    }

    return persons;
  })(user_id);
};

const getStatusByUserId = function (user_id) {
  return (async (user_id) => {
    const first: any = await frdb.findAll({
      attributes: [
        ["user_second_id", "user_id"],
        ["type", "type"],
      ],
      where: {
        user_first_id: user_id,
        type: {
          [Op.or]: [FRIENDS, PENDING_FIRST_SECOND, PENDING_SECOND_FIRST],
        },
      },
      raw: true,
    });
    consola.log("Known persons on first position: ", first);
    const relationships = new Array<any>();
    for (let i = 0; i < first.length; i++) {
      let status;
      switch (first[i].type) {
        case FRIENDS: {
          status = FRIEND_LIST_STATUS_MUTUAL;
          break;
        }
        case PENDING_FIRST_SECOND: {
          status = FRIEND_LIST_STATUS_WAITING;
          break;
        }
        case PENDING_SECOND_FIRST: {
          status = FRIEND_LIST_STATUS_CONFIRMING;
          break;
        }
        default: {
          break;
        }
      }
      relationships.push({
        user_id: first[i].user_id,
        status: status,
      });
    }

    const second: any = await frdb.findAll({
      attributes: [
        ["user_first_id", "user_id"],
        ["type", "type"],
      ],
      where: {
        user_second_id: user_id,
        type: {
          [Op.or]: [FRIENDS, PENDING_FIRST_SECOND, PENDING_SECOND_FIRST],
        },
      },
      raw: true,
    });
    consola.log("Known persons on first position: ", second);
    for (let i = 0; i < second.length; i++) {
      let status;
      switch (second[i].type) {
        case FRIENDS: {
          status = FRIEND_LIST_STATUS_MUTUAL;
          break;
        }
        case PENDING_FIRST_SECOND: {
          status = FRIEND_LIST_STATUS_CONFIRMING;
          break;
        }
        case PENDING_SECOND_FIRST: {
          status = FRIEND_LIST_STATUS_WAITING;
          break;
        }
        default: {
          break;
        }
      }
      relationships.push({
        user_id: second[i].user_id,
        status: status,
      });
    }

    return relationships;
  })(user_id);
};

export {
  request,
  confirm,
  remove,
  reject,
  getFriendListByUserId,
  getKnownByUserId,
  getStatusByUserId,
  findAll,
};
