import * as fs from "fs";
import { join as path } from "path";

export function readData(file: string) {
  if (!fs.existsSync(path(__dirname, "../data", file + ".json"))) { return; }
  return JSON.parse(fs.readFileSync(path(__dirname, "../data", file + ".json"), "utf-8"));
}

export function writeData(file: string, data: object) {
  fs.writeFileSync(path(__dirname, "../data", file + ".json"), JSON.stringify(data, undefined, 2));
}
