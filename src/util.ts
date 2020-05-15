import * as fs from "fs";
import * as path from "path";

export function ensureFolders(...p: string[]) {
  var currentPath;
  for (var newPath of p) {
    if (!currentPath) currentPath = newPath;
    else currentPath = path.join(currentPath, newPath);
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
  }
}
