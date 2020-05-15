import Discord from "discord.js";
import path from "path";
import readdir from "fs-readdir-recursive"

import * as data from "./data";
import ModIdea from "./data_types/mod_idea";

export function createModIdea(message: Discord.Message) {
  let last = getLastFileId();
  let ideas = data.read("mod_ideas/" + last, []) as ModIdea[];

  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  const idea = new ModIdea(getNextID(), message.content, message.author.id, message.attachments.size > 0 ? message.attachments.first()?.url : undefined);

  ideas.push(idea);
  data.write("modideas/" + last, ideas);

  return idea;
}

function getNextID(): number {
  var last = getLastFileId();
  var ideas = data.read("modideas/" + last, []);

  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  return last * 100 + ideas.length + 1;
}

function getLastFileId() {
  return Math.max(0, ...readdir(path.join(__dirname, "../data/mod_ideas"))
    .filter((p) => p.endsWith(".json"))
    .map((p) => parseInt(p.substring(0, p.length - 5))),
  );
}