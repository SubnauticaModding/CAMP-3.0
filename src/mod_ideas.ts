import * as Discord from "discord.js";
import read from "fs-readdir-recursive"
import { join as path } from "path";

import { readData, writeData } from "./data";

export function createModIdea(message: Discord.Message) {
  var last = getLastFileID();
  var ideas = readData("modideas/" + last) as any[];
  if (!ideas) ideas = [];
  if (ideas.length == 100) {
    ideas = [];
    last++;
  }
  ideas.push({
    id: getNextID(),
    author: message.author.id,
    text: message.content,
  })
  writeData("modideas/" + last, ideas);
}

function getNextID() {
  var last = getLastFileID();
  var ideas = readData("modideas/" + last) as any[];
  if (!ideas) ideas = [];
  if (ideas.length == 100) {
    ideas = [];
    last++;
  }
  return last * 100 + ideas.length + 1;
}

function getLastFileID() {
  return Math.max(0, ...read(path(__dirname, "../data/modideas")).filter(p => p.endsWith(".json")).map(p => parseInt(p.substring(0, p.length - 5))));
}