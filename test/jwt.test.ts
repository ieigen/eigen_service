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

import { expect } from "chai";
import jsonwebtoken from "jsonwebtoken";
import consola from "consola";

describe("JWT token generate", () => {
  it("should generate correctly", () => {
    const user_info = {
      user_id: 0,
      email: "EigenNetwork@gmail.com",
      name: "Eigen NetWork",
      given_name: "Eigen NetWork",
      family_name: "Eigen NetWork",
      picture: "",
      locale: "SG",
      verified_email: "EigenNetwork@gmail.com",
    };

    const JWT_SECRET = "Example-Secret";

    const token = jsonwebtoken.sign(user_info, JWT_SECRET);
    consola.log(token);
    const veri = jsonwebtoken.verify(token, JWT_SECRET);
    expect(veri.email).to.eq(user_info.email);

    const t =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJlbWFpbCI6IkVpZ2VuTmV0d29ya0BnbWFpbC5jb20iLCJuYW1lIjoiRWlnZW4gTmV0V29yayIsImdpdmVuX25hbWUiOiJFaWdlbiBOZXRXb3JrIiwiZmFtaWx5X25hbWUiOiJFaWdlbiBOZXRXb3JrIiwicGljdHVyZSI6IiIsImxvY2FsZSI6IlNHIiwidmVyaWZpZWRfZW1haWwiOiJFaWdlbk5ldHdvcmtAZ21haWwuY29tIiwiaWF0IjoxNjQ0NzU3OTgyfQ.P_gq1eqZtUehIRbjhUl9gFRMVzxc7TcbLgBdhwHVGV0";
    const ccccc = jsonwebtoken.verify(t, JWT_SECRET);
    consola.log(ccccc);
  });
});
