import * as Discord from "discord.js";
import read from "fs-readdir-recursive";
import { join as path } from "path";

import { bot } from "..";
import config from "../config.json";
import { ModIdea } from "./classes/modIdea";
import { readData, writeData } from "./data";
import { IdeaStatus } from "./enums/ideaStatus";

export function createModIdea(message: Discord.Message) {
  let last = getLastFileId();
  let ideas = readData("modideas/" + last) as any[] || [];

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

export async function sendModIdea(idea: ModIdea, channel: string | Discord.TextChannel, main = false, react = true) {
  if (typeof channel === "string") channel = bot.channels.get(channel) as Discord.TextChannel;
  const message = await channel.send(await generateIdeaEmbed(idea)) as Discord.Message;
  if (main) {
    idea.message = message.id;
    updateModIdea(idea);
  }
  if (react) {
    await message.react(config.EMOJIS.VOTE.UPVOTE);
    await message.react(config.EMOJIS.VOTE.ABSTAIN);
    await message.react(config.EMOJIS.VOTE.DOWNVOTE);
    message.react(config.EMOJIS.VOTE.EDIT);
  }
}

export async function editModIdea(idea: ModIdea, message: Discord.Message) {
  message.edit(await generateIdeaEmbed(idea));
}

export function updateModIdea(idea: ModIdea) {
  const file = Math.floor((idea.id - 1) / 100);
  const index = (idea.id - 1) % 100;

  const ideas = readData("modideas/" + file) as any[];
  if (!ideas) return idea;
  ideas[index] = idea;
  writeData("modideas/" + file, ideas);

  return idea;
}

export function getModIdea(id: number) {
  const file = Math.floor((id - 1) / 100);
  const index = (id - 1) % 100;

  const ideas = readData("modideas/" + file) as any[];
  if (!ideas) return;
  return ideas[index];
}

export function getModIdeaFromMessage(message: Discord.Message) {
  if (message.author.id !== bot.user.id) return false;
  if (!message.embeds || message.embeds.length < 1) return false;

  const embed = message.embeds[0];
  if (!embed || !embed.footer.text || embed.footer.text === "") return false;

  let footer = embed.footer.text;
  if (!footer.startsWith(config.STRINGS.IDEA_EMBED.FOOTER)) return false;

  footer = footer.substring(config.STRINGS.IDEA_EMBED.FOOTER.length);
  if (parseInt(footer).toString() !== footer) return false;

  const idea = getModIdea(parseInt(footer));
  return idea === undefined ? false : idea;
}

export function getNextId() {
  let last = getLastFileId();
  let ideas = readData("modideas/" + last) as any[] || [];

  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  return last * 100 + ideas.length + 1;
}

async function generateIdeaEmbed(idea: ModIdea) {
  const user = await bot.fetchUser(idea.author);
  const rating = idea.rating.likes.length - idea.rating.dislikes.length;
  return new Discord.RichEmbed()
    .setAuthor(user.tag, user.displayAvatarURL)
    .setColor(getColorFromStatus(idea))
    .setDescription(idea.text)
    .addField(config.STRINGS.IDEA_EMBED.LIKES.NAME, config.STRINGS.IDEA_EMBED.LIKES.VALUE
      .replace("{likes}", idea.rating.likes.length.toString())
      .replace("{upvote}", "<:a:" + config.EMOJIS.VOTE.UPVOTE + ">"), true)
    .addField(config.STRINGS.IDEA_EMBED.DISLIKES.NAME, config.STRINGS.IDEA_EMBED.DISLIKES.VALUE
      .replace("{dislikes}", idea.rating.dislikes.length.toString())
      .replace("{downvote}", "<:a:" + config.EMOJIS.VOTE.DOWNVOTE + ">"), true)
    .addField(config.STRINGS.IDEA_EMBED.RATING.NAME, config.STRINGS.IDEA_EMBED.RATING.VALUE
      .replace("{rating}", (rating <= 0 ? "" : "+") + rating), true)
    .setFooter(config.STRINGS.IDEA_EMBED.FOOTER + idea.id)
    .setImage(idea.image ? idea.image : "")
    .setTimestamp(idea.time)
    .setTitle(getTitleFromStatus(idea));
}

function getLastFileId() {
  return Math.max(0, ...read(path(__dirname, "../data/modideas"))
    .filter((p) => p.endsWith(".json"))
    .map((p) => parseInt(p.substring(0, p.length - 5))),
  );
}

function getColorFromStatus(status: ModIdea | IdeaStatus) {
  if (status instanceof ModIdea || typeof status === "object") status = status.status;
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

function getTitleFromStatus(status: ModIdea | IdeaStatus) {
  if (status instanceof ModIdea || typeof status === "object") status = status.status;
  switch (status) {
    case IdeaStatus.Deleted:
      return config.STRINGS.IDEA_EMBED.TITLE.DELETED;
    case IdeaStatus.Duplicate:
      return config.STRINGS.IDEA_EMBED.TITLE.DUPLICATE;
    case IdeaStatus.Removed:
      return config.STRINGS.IDEA_EMBED.TITLE.REMOVED;
    case IdeaStatus.None:
      return config.STRINGS.IDEA_EMBED.TITLE.NONE;
    case IdeaStatus.Released:
      return config.STRINGS.IDEA_EMBED.TITLE.RELEASED;
    default:
      return config.STRINGS.IDEA_EMBED.TITLE.UNKNOWN;
  }
}
