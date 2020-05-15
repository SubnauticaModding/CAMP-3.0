import Discord from "discord.js";
import fs from "fs";
import path from "path";

export function ensureFolders(...p: string[]) {
  var currentPath;
  for (var newPath of p) {
    if (!currentPath) currentPath = newPath;
    else currentPath = path.join(currentPath, newPath);
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
  }
}
