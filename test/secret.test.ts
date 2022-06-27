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
