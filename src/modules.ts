import { readData, writeData } from "./data";

export function enableModule(id: string) {
  var modules = readData("modules");
  if (!modules) modules = {};
  modules[id] = true;
  writeData("modules", modules);
}

export function disableModule(id: string) {
  var modules = readData("modules");
  if (!modules) modules = {};
  modules[id] = false;
  writeData("modules", modules);
}

export function moduleEnabled(id: string) {
  var modules = readData("modules");
  if (!modules || !modules[id]) return false;
  return true;
}

export function getModules() {
  var modules = readData("modules");
  if (!modules) modules = {};
  return modules;
}