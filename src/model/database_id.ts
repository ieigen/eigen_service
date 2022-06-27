/**
 * Copyright 2021-2022 Eigen Network
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
// database_id.ts
/**
 * User information model definition
 *
 * @module database_id
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sequelize, DataTypes, Op } from "sequelize";
import consola from "consola";

const sequelize = new Sequelize({
  dialect: "sqlite",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: "./data/db_user.sqlite",
});

/**
 * User kind, e.g., Google
 *
 * @enum
 */
export enum UserKind {
  GOOGLE,
  TWITTER,
  METAMASK,
}

const userdb = sequelize.define("user_st", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  kind: DataTypes.INTEGER, // 0: google, 1, twitter,,
  unique_id: DataTypes.STRING, // id from third-paty
  email: DataTypes.CITEXT,
  name: DataTypes.STRING,
  given_name: DataTypes.STRING,
  family_name: DataTypes.STRING,
  locale: DataTypes.STRING,
  verified_email: DataTypes.INTEGER, // 0 no, 1 yes
  picture: DataTypes.STRING,
  secret: DataTypes.STRING,
  password_hash: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});

sequelize
  .sync()
  .then(function () {
    return userdb.create({
      kind: 0,
      unique_id: "1",
      email: "1@a.com",
      name: "eig",
      given_name: "1",
      family_name: "2",
      locale: "en-US",
      verified_email: 0,
      picture: "1",
      secret: "1",
      password_hash: "",
    });
  })
  .then(function (row: any) {
    consola.log(
      row.get({
        plain: true,
      })
    );
    userdb.destroy({ where: { user_id: row.user_id } });
  })
  .catch(function (err) {
    consola.log("Unable to connect to the database:", err);
  });

const add = function (user_info) {
  return userdb.create(user_info);
};

const findAll = function () {
  return userdb.findAll();
};

const findByID = function (user_id: string) {
  return userdb
    .findOne({ where: { user_id: user_id } })
    .then(function (row: any) {
      consola.log("yes", row);
      return row;
    });
};

const findByOpenID = function (id: string, kind: number) {
  return userdb
    .findOne({ where: { unique_id: id, kind: kind } })
    .then(function (row: any) {
      consola.log(row);
      return row;
    });
};

const findByEmail = function (email: string) {
  return userdb
    .findOne({ where: { email: email.trim() }, raw: true })
    .then(function (row: any) {
      consola.log(row);
      return row;
    });
};

const updateOrAdd = function (user_id, new_info) {
  return userdb
    .findOne({ where: { user_id: user_id } })
    .then(function (row: any) {
      consola.log("Find one user: ", row);
      if (row === null) {
        add(new_info);
        return true;
      }
      const concatenated = { ...row["dataValues"], ...new_info };
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

const updateSecret = function (user_id, secret) {
  return userdb.findOne({ where: { user_id } }).then(function (row: any) {
    if (row === null) {
      consola.log("Update error: User does not exist");
      return false;
    }
    return row
      .update({
        secret: secret,
      })
      .then(function (result) {
        consola.log("Update success: " + result);
        return true;
      })
      .catch(function (err) {
        consola.log("Update error: " + err);
        return false;
      });
  });
};

const updatePasswordHash = function (user_id, password_hash) {
  return userdb.findOne({ where: { user_id } }).then(function (row: any) {
    if (row === null) {
      consola.log("Update error: User does not exist");
      return false;
    }
    return row
      .update({
        password_hash: password_hash,
      })
      .then(function (result) {
        consola.log("Update success: " + result);
        return true;
      })
      .catch(function (err) {
        consola.log("Update error: " + err);
        return false;
      });
  });
};

const findUsersInformation = function (ids) {
  return userdb.findAll({
    attributes: ["user_id", "email", "name"],
    where: {
      user_id: {
        [Op.in]: ids,
      },
    },
    raw: true,
  });
};

const findAllUserIDs = function () {
  return userdb
    .findAll({
      attributes: [["user_id", "user_id"]],
      raw: true,
    })
    .then(function (row: any) {
      consola.log(row);
      if (row === null) {
        return new Set();
      }
      const users = new Set();
      for (let i = 0; i < row.length; i++) {
        users.add(row[i].user_id);
      }
      return users;
    })
    .catch(function (err) {
      consola.log("Find error: " + err);
      return new Set();
    });
};

export {
  updateOrAdd,
  findAll,
  add,
  findByOpenID,
  findByID,
  findAllUserIDs,
  findUsersInformation,
  findByEmail,
  updateSecret,
  updatePasswordHash,
};
