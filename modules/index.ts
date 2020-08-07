// This file automatically imports all enabled modules.

import fs from "fs";
import path from "path";
import config from "../src/config";

for (const file of fs.readdirSync(__dirname)) {
  if (file.endsWith(".js") || file.endsWith(".map")) continue;
  if (!config.modules.hasOwnProperty(file)) {
    console.warn("Found module folder which is not present in config: " + file);
    continue;
  }
  // @ts-ignore 7053
  if (config.modules[file].enable) import(path.join(".", file));
}