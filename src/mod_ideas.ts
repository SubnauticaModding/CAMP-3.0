import * as Discord from "discord.js";
import read from "fs-readdir-recursive"
import { join as path } from "path";

import { readData } from "./data";

export function createModIdea(message: Discord.Message) {
  var last = Math.max(...read(path(__dirname, "../data/modideas")).filter(p => p.endsWith(".json")).map(p => parseInt(p.substring(0, p.length - 5))));
  var ideas = readData("modideas/" + last) as any[];
  if (ideas.length == 100) {
    ideas = [];
    last++;
  }
  ideas.push({

  })
}

function getNextID() {
  return Math.max(...db.prepare("SELECT * FROM modideas").all().filter(m => m.id)) + 1;
}