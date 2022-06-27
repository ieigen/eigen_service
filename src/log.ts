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

// log.ts
/**
 * The log utils
 *
 * @module log
 */

import * as path from "path";
import * as log4js from "log4js";

const configure = function () {
  log4js.configure(path.join(__dirname, "log4js.json"));
};

const logger = function (name) {
  const dateFileLog = log4js.getLogger(name);
  dateFileLog.level = "debug";
  return dateFileLog;
};

const useLog = function () {
  return log4js.connectLogger(log4js.getLogger("app"), { level: "debug" });
};

export { useLog, logger, configure };
