// This file automatically imports all of the files in this folder and all subfolders.

import readdir from "fs-readdir-recursive";
import path from "path";

const files = readdir(__dirname, (path) => {
  if (path.endsWith("index.js")) return false;
  if (path.endsWith(".js")) return true;
  return false;
});

for (const file of files) {
  import(path.join(".", file.substr(0, file.length - 3)));
}