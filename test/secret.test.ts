import * as sec from "../src/crypto/secretshare";
import * as mocha from "mocha";
import { expect } from "chai";
import consola from "consola";

describe("secret share lib", () => {
  it("should be combine correctly", () => {
    let key = sec.generate_key();
    key = key.slice(2); // remove prefix 0x
    const shares = sec.split(key, sec.SecLevel.WEAK);
    consola.log(shares);
    const comb = sec.combine(shares);
    consola.log(key, comb);
    expect(comb).to.equal(key);
  });
});
