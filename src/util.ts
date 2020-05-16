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

export function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

declare global {
  interface String {
    replaceAsync(regexp: RegExp, func: (substring: string, ...args: any[]) => Promise<string>): Promise<string>;
  }
}

String.prototype.replaceAsync = async function (regex: RegExp, func: (substring: string, ...args: any[]) => Promise<string>): Promise<string> {
  const promises: Promise<string>[] = [];
  this.replace(regex, (substring, ...args) => {
    const promise = func(substring, ...args);
    promises.push(promise);
    return substring;
  });
  const data = await Promise.all(promises);
  return this.replace(regex, (substring) => data.shift() ?? substring);
}