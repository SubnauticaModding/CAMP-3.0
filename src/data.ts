import * as fs from "fs";
import { join as path } from "path";

export function readData(file: string, def: any) {
  if (!fs.existsSync(path(__dirname, "../data", file + ".json"))) return def;
  try {
    const ret = JSON.parse(fs.readFileSync(path(__dirname, "../data", file + ".json"), "utf-8"));
    return ret ? ret : def;
  } catch (e) {
    return def;
  }
}

export function writeData(file: string, data: object) {
  fs.writeFileSync(path(__dirname, "../data", file + ".json"), JSON.stringify(data, undefined, 2));
}
