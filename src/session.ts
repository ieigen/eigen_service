// session.ts
/**
 * Session related processing
 *
 * @module session
 */

import consola from "consola";

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
export module Session {
  export class session {
    token: string;
    expiry: number;
    issueTime: number;
    constructor(t: string, e: number) {
      this.token = t;
      this.expiry = e;
      this.issueTime = Math.floor(Date.now() / 1000);
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
  const user_token: Map<string, session> = new Map();

  export function check_token(key: string) {
    const sess = user_token.get(key);
    if (sess !== undefined && sess.isValid()) {
      user_token.set(key, sess);
      return sess.token;
    }
    user_token.delete(key);
    return null;
  }

  export function add_token(key: string, sess: session) {
    user_token.set(key, sess);
  }
}
