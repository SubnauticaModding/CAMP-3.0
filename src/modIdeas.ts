import * as Discord from "discord.js";
import read from "fs-readdir-recursive";
import { join as path } from "path";

import { bot } from "..";
import config from "../config.json";
import { ModIdea } from "./classes/modIdea";
import { readData, writeData } from "./data";
import { IdeaStatus } from "./enums/ideaStatus";

export function createModIdea(message: Discord.Message) {
  let last = getLastFileID();
  let ideas = readData("modideas/" + last) as ModIdea[];

  if (!ideas) { ideas = []; }
  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  const idea = new ModIdea();
  idea.text = message.content;
  idea.author = message.author.id;
  idea.image = message.attachments.size > 0 ? message.attachments.first().url : undefined;

  ideas.push(idea);
  writeData("modideas/" + last, ideas);

  return idea;
}

export async function sendModIdea(idea: ModIdea, channel: string | Discord.TextChannel) {
  if (typeof channel === "string") {
    channel = bot.channels.get(channel) as Discord.TextChannel;
  }
  channel.send(await generateIdeaEmbed(idea));
}

async function generateIdeaEmbed(idea: ModIdea) {
  const user = await bot.fetchUser(idea.author);
  return new Discord.RichEmbed()
    .setColor(getColorFromStatus(idea))
    .setAuthor(user.tag, user.displayAvatarURL)
    .setDescription(idea.text)
    .setImage(idea.image ? idea.image : "")
    .setTimestamp(idea.time)
    .addField(config.STRINGS.IDEA_EMBED.RATING.TEXT, config.STRINGS.IDEA_EMBED.RATING.VALUE
      .replace("{likes}", idea.rating.likes.toString())
      .replace("{dislikes}", idea.rating.dislikes.toString())
      .replace("{rating}", idea.rating.rating.toString()),
    );
}

export function getNextID() {
  let last = getLastFileID();
  let ideas = readData("modideas/" + last) as ModIdea[];

  if (!ideas) { ideas = []; }
  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  return last * 100 + ideas.length + 1;
}

function getLastFileID() {
  return Math.max(0, ...read(path(__dirname, "../data/modideas"))
    .filter((p) => p.endsWith(".json"))
    .map((p) => parseInt(p.substring(0, p.length - 5), 10)),
  );
}

function getColorFromStatus(status: ModIdea | IdeaStatus) {
  if (status instanceof ModIdea) { status = status.status; }
  switch (status) {
    case IdeaStatus.Deleted:
      return config.COLORS.DELETED;
    case IdeaStatus.Duplicate:
      return config.COLORS.DUPLICATE;
    case IdeaStatus.Removed:
      return config.COLORS.REMOVED;
    case IdeaStatus.None:
      return config.COLORS.NONE;
    case IdeaStatus.Released:
      return config.COLORS.RELEASED;
    default:
      return config.COLORS.UNKNOWN;
  }
}
