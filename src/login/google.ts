// google.ts
/**
 * Provide google related login processes
 *
 * @module login
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import jsonwebtoken from "jsonwebtoken";
import axios from "axios";
import querystring from "querystring";
import * as crypto from "crypto";
import consola from "consola";
import "dotenv/config";

import { Session } from "../session";

import * as util from "../util";
import * as userdb from "../model/database_id";
import * as metamask from "./metamask";
import * as addressdb from "../model/database_address";

util.require_env_variables([
  "SERVER_ROOT_URI",
  "GOOGLE_CLIENT_ID",
  "JWT_SECRET",
  "GOOGLE_CLIENT_SECRET",
  "COOKIE_NAME",
  "UI_ROOT_URI",
]);

module.exports = function (app) {
  const redirectURI = "auth/google";

  function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
  }

  // Getting login URL
  app.get("/auth/google/url", (req, res) => {
    return res.send(getGoogleAuthURL());
  });

  function getTokens({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }> {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    consola.log(values);
    return <any>axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`, error);
        throw new Error(error.message);
      });
  }
  // Getting the user from Google with the code
  app.get(`/${redirectURI}`, async (req, res) => {
    const code = req.query.code as string;
    consola.log("res", req.query);
    const { id_token, access_token } = await getTokens({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
    });
    consola.log("token", id_token, access_token);

    // Fetch the user's profile with the access token and bearer
    const user: any = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
    consola.log("user", user);

    let exist_user;
    let isNew = 0;

    if (metamask.hasAssociation(user.email)) {
      const [associated_user_id, associated_user_address] =
        metamask.getAssociation(user.email);

      consola.info(
        `Goolge login with association with an address: '${associated_user_id}': '${associated_user_address}' with ${user.google}`
      );

      const address_record: any = await addressdb.findOne({
        user_address: associated_user_address,
      });

      const to_update_user_id = address_record["user_id"];

      if (to_update_user_id) {
        consola.info("Find exist user by id: ", to_update_user_id);
        exist_user = await userdb.findByID(to_update_user_id);
        isNew = 0;
      } else {
        consola.info(
          "Does not find the exist user id by address? Maybe a fresh user logged in"
        );
        exist_user = null;
        isNew = 1;
      }
      metamask.deleteAssociation(user.email);
    } else {
      // Does not exist association
      consola.info("Goolge login without association with an address");
      exist_user = await userdb.findByOpenID(user.id, userdb.UserKind.GOOGLE);
      isNew = 0;
    }

    consola.log("exist_user", exist_user);
    let user_info;

    if (exist_user === null) {
      //add to db
      user_info = {
        kind: userdb.UserKind.GOOGLE,
        email: user.email,
        name: user.name,
        given_name: user.given_name,
        family_name: user.family_name,
        unique_id: user.id,
        picture: user.picture,
        locale: user.locale,
        verified_email: user.verified_email,
        secret: "",
      };
      consola.log(user_info);
      const result = await userdb.add(user_info);
      isNew = 1;
      consola.log("add", result);
    } else {
      user_info = {
        email: user.email || exist_user.email,
        name: user.name || exist_user.name,
        given_name: user.given_name || exist_user.given_name,
        family_name: user.family_name || exist_user.family_name,
        picture: user.picture || exist_user.picture,
        locale: user.locale || exist_user.locale,
        verified_email: user.verified_email || exist_user.verified_email,
        kind: userdb.UserKind.GOOGLE, // Here, we convert a METAMASK kind into GOOGLE
      };
      const result = await userdb.updateOrAdd(exist_user.user_id, user_info);
      consola.log("update", result);
    }

    const user_record: any = await userdb.findByOpenID(
      user.id,
      userdb.UserKind.GOOGLE
    );

    user_info.user_id = user_record.user_id;

    const token = jsonwebtoken.sign(user_info, process.env.JWT_SECRET);
    consola.log("user cookie", token);

    /*
    res.cookie(COOKIE_NAME, token, {
      maxAge: 900,
      httpOnly: true,
      secure: false,
      domain: "ieigen.com",
      //path: '/',
      sameSite: 'Lax',
    });
   */

    consola.log("user record: ", user_record);

    const hash = crypto.createHash("sha256");
    const hashcode = hash.update(token).digest("hex");
    consola.log(hashcode);
    Session.add_token(hashcode, new Session.session(token, 3600));
    res.redirect(
      `${process.env.UI_ROOT_URI}?id=${user_record.user_id}&${process.env.COOKIE_NAME}=${hashcode}&new=${isNew}`
    );
  });
};
