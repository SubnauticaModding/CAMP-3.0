import * as fs from "fs";
import * as path from "path";

import * as util from "./util";

export function read<DataType>(file: string, def: DataType): DataType {
  util.ensureFolders("dist", "data", ...file.split("/").filter((_, i, a) => i != a.length - 1));
  if (!fs.existsSync(path.join(__dirname, "../data", file + ".json"))) return def;
  try {
    const ret = JSON.parse(fs.readFileSync(path.join(__dirname, "../data", file + ".json"), "utf-8"));
    return ret ? ret : def;
  } catch (e) {
    return def;
  }
}

export function write(file: string, data: object) {
  util.ensureFolders("dist", "data", ...file.split("/").filter((_, i, a) => i != a.length - 1));
  fs.writeFileSync(path.join(__dirname, "../data", file + ".json"), JSON.stringify(data, undefined, 2));
}