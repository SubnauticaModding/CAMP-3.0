// This file automatically imports all enabled modules.

import fs from "fs";
import path from "path";
import config from "../src/config";

for (const file of fs.readdirSync(__dirname)) {
  if (file.endsWith(".js") || file.endsWith(".map") || file == "common") continue;
  console.log("Found module " + path.join(__dirname, file));
  if (!config.modules.hasOwnProperty(file)) {
    console.warn("Module not present in config: " + file);
    continue;
  }
  // @ts-ignore 7053
  if (config.modules[file].enable) {
    console.log("Loading module " + path.join(__dirname, file) + "...");
    import(path.join(__dirname, file));
    console.log("Loaded module " + path.join(__dirname, file));
  } else {
    console.log("Skipping module " + path.join(__dirname, file));
  }
}