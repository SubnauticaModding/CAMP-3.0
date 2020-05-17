import * as fs from "fs";
import * as path from "path";

export function read<DataType>(file: string, def: DataType): DataType {
  if (!fs.existsSync(path.join(__dirname, "../data", file + ".json"))) return def;
  try {
    const ret = JSON.parse(fs.readFileSync(path.join(__dirname, "../data", file + ".json"), "utf-8"));
    return ret ? ret : def;
  } catch (e) {
    return def;
  }
}

export function write(file: string, data: object) {
  fs.writeFileSync(path.join(__dirname, "../data", file + ".json"), JSON.stringify(data, undefined, 2));
}