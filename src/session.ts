// session.ts
/**
 * Session related processing
 *
 * @module session
 */

import consola from "consola";
import * as db_session from "./model/database_session";

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
export module Session {
  export class session {
    token: string;
    expiry: number;
    issueTime: number;
    constructor(t: string, e: number, issue_time?: number) {
      this.token = t;
      this.expiry = e;
      if (issue_time) {
        this.issueTime = issue_time;
      } else {
        this.issueTime = Math.floor(Date.now() / 1000);
      }
    }

    isValid(this: session): boolean {
      const cur = Math.floor(Date.now() / 1000);
      consola.info(this, cur);
      if (this.issueTime + this.expiry >= cur) {
        this.issueTime = cur;
        return true;
      }
      return false;
    }
  }

  //TODO use redis in production
  //     Now we use sequenize
  // const user_token: Map<string, session> = new Map();

  export function check_token(key: string) {
    return db_session.findOne({ hash_code: key }).then(function (row: any) {
      if (row === null) {
        // Not found the session
        return null;
      }

      const token = row["dataValues"]["token"];
      const expiry = row["dataValues"]["expiry"];
      const issue_time = row["dataValues"]["issue_time"];

      // NOTE: Shouls use issue_time in database here
      const sess = new session(token, expiry, issue_time);

      if (sess.isValid()) {
        db_session.updateOrAdd(key, sess.token, sess.expiry, sess.issueTime);

        return sess.token;
      } else {
        db_session.deleteSession(key);
        return null;
      }
    });
  }

  export function add_token(key: string, sess: session) {
    // user_token.set(key, sess);
    return db_session.updateOrAdd(key, sess.token, sess.expiry, sess.issueTime);
  }
}
