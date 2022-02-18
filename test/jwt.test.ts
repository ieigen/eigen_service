import { expect } from "chai";
import jsonwebtoken from "jsonwebtoken";
const consola = require("consola");

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
