import * as fs from "fs";
import * as path from "path";
import * as util from "./util";

/**
 * Reads data from the `data` folder
 * @param file The path to the file from which to read.
 * 
 * Example: "Folder1/Folder2/File" will read the data from "dist/data/Folder1/Folder2/File.json"
 * @param def The default value to return if there is no data.
 * @param pblic If `true`, reads data from `public_data`. 
 * 
 * If `false`, reads data from `dist/data`.
 * 
 * Defaults to `false`.
 */
export function read<DataType>(file: string, def: DataType, pblic = false): DataType {
  if (!pblic) {
    util.ensureFolders("dist", "data", ...file.split("/").filter((_, i, a) => i != a.length - 1));
    if (!fs.existsSync(path.join(__dirname, "../data", file + ".json"))) return def;
    try {
      const ret = JSON.parse(fs.readFileSync(path.join(__dirname, "../data", file + ".json"), "utf-8"));
      return ret ? ret : def;
    } catch (e) {
      return def;
    }
  } else {
    util.ensureFolders("public_data", ...file.split("/").filter((_, i, a) => i != a.length - 1));
    if (!fs.existsSync(path.join(__dirname, "../../public_data", file + ".json"))) return def;
    try {
      const ret = JSON.parse(fs.readFileSync(path.join(__dirname, "../../public_data", file + ".json"), "utf-8"));
      return ret ? ret : def;
    } catch (e) {
      return def;
    }
  }
}

/**
 * Writes data from the `data` folder
 * @param file The path to the file in which to write.
 * 
 * Example: "Folder1/Folder2/File" will write the data in "dist/data/Folder1/Folder2/File.json"
 * @param data The data to write
 * @param pblic If `true`, writes data to `public_data`. 
 * 
 * If `false`, writes data to `dist/data`.
 * 
 * Defaults to `false`.
 */
export function write(file: string, data: string | number | boolean | null | undefined | {} | any[], pblic = false) {
  if (!pblic) {
    util.ensureFolders("dist", "data", ...file.split("/").filter((_, i, a) => i != a.length - 1));
    fs.writeFileSync(path.join(__dirname, "../data", file + ".json"), JSON.stringify(data, undefined, 2));
  } else {
    util.ensureFolders("public_data", ...file.split("/").filter((_, i, a) => i != a.length - 1));
    fs.writeFileSync(path.join(__dirname, "../../public_data", file + ".json"), JSON.stringify(data, undefined, 2));
  }
}