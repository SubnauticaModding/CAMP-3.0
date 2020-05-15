import Discord from "discord.js";
import path from "path";
import readdir from "fs-readdir-recursive"

import { bot } from "..";
import config from "./config";
import * as data from "./data";
import ModIdea from "./data_types/mod_idea";
import ModIdeaStatus from "./data_types/mod_idea_status";

export function createModIdea(message: Discord.Message) {
  var last = getLastFileId();
  var ideas = data.read("mod_ideas/" + last, []) as ModIdea[];

  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  const idea = new ModIdea(getNextID(), message.content, message.author.id, message.attachments.size > 0 ? message.attachments.first()?.url : undefined);

  ideas.push(idea);
  data.write("mod_ideas/" + last, ideas);

  return idea;
}

export async function sendModIdea(idea: ModIdea, channel: string | Discord.TextChannel, main = false, react = true) {
  if (typeof channel === "string") channel = bot.channels.cache.get(channel) as Discord.TextChannel;
  const message = await channel.send(await generateIdeaEmbed(idea)) as Discord.Message;
  if (main) {
    idea.channel = channel.id;
    idea.message = message.id;
    updateModIdea(idea);
  }
  if (react) {
    addReactions(message);
  }
  return message;
}

export async function editModIdea(idea: ModIdea, message: Discord.Message) {
  message.edit(await generateIdeaEmbed(idea));
}

export function updateModIdea(idea: ModIdea) {
  const file = Math.floor((idea.id - 1) / 100);
  const index = (idea.id - 1) % 100;

  const ideas = data.read("mod_ideas/" + file, []) as ModIdea[];
  if (!ideas) return idea;
  ideas[index] = idea;

  data.write("mod_ideas/" + file, ideas);

  return idea;
}

export function getModIdea(id: number): ModIdea | undefined {
  const file = Math.floor((id - 1) / 100);
  const index = (id - 1) % 100;

  const ideas = data.read("mod_ideas/" + file, []) as any[];
  if (!ideas) return;
  return ideas[index] as ModIdea;
}

export function getModIdeaFromMessage(message: Discord.Message): ModIdea | undefined {
  if (message.author.id !== bot.user?.id) return;
  if (!message.embeds || message.embeds.length < 1) return;

  const embed = message.embeds[0];
  if (!embed || !embed.footer?.text) return;

  var footer = embed.footer.text;
  if (!footer.startsWith("ID: #")) return;

  footer = footer.substring("ID: #".length);
  if (parseInt(footer).toString() !== footer) return;

  return getModIdea(parseInt(footer));
}

async function generateIdeaEmbed(idea: ModIdea) {
  const user = await bot.users.fetch(idea.author);
  const rating = idea.rating.likes.length - idea.rating.dislikes.length;

  const embed = new Discord.MessageEmbed()
    .setAuthor(user.tag, user.displayAvatarURL())
    .setColor(getColorFromStatus(idea.status))
    .setDescription(idea.text);

  switch (idea.status) {
    case ModIdeaStatus.None:
      embed.addField("Rating", `<:a:${getEmojiForRating(rating)}> \`${rating}\``, true)
        .addField("Votes", idea.rating.likes.length + idea.rating.dislikes.length, true);
      break;
    case ModIdeaStatus.Released:
      embed.addField("Status", "Released at " + idea.specialComment);
      break;
  }

  if (idea.comment) embed.addField("Comment", idea.comment);

  embed.setFooter("ID: #" + idea.id)
    .setImage(idea.image ?? "")
    .setTimestamp(idea.time)
    .setTitle(getTitleFromStatus(idea.status));

  return embed;
}

function getColorFromStatus(status: ModIdeaStatus): string {
  switch (status) {
    case ModIdeaStatus.Deleted:
      return "000000";
    case ModIdeaStatus.Duplicate:
      return "FFF99A";
    case ModIdeaStatus.Removed:
      return "FF2D19";
    case ModIdeaStatus.None:
      return "79CEFF";
    case ModIdeaStatus.Released:
      return "6EF273";
  }
}

function getTitleFromStatus(status: ModIdeaStatus): string {
  switch (status) {
    case ModIdeaStatus.Deleted:
      return "Deleted Mod Idea";
    case ModIdeaStatus.Duplicate:
      return "Duplicate Mod Idea";
    case ModIdeaStatus.Removed:
      return "Removed Mod Idea";
    case ModIdeaStatus.None:
      return "Mod Idea";
    case ModIdeaStatus.Released:
      return "Released Mod Idea";
  }
}

function getEmojiForRating(rating: number): string {
  if (rating < 0) return config.emojis.downvote;
  if (rating > 0) return config.emojis.upvote;
  return config.emojis.abstain;
}

function getNextID(): number {
  var last = getLastFileId();
  var ideas = data.read("mod_ideas/" + last, []);

  if (ideas.length === 100) {
    ideas = [];
    last++;
  }

  return last * 100 + ideas.length + 1;
}

function getLastFileId(): number {
  return Math.max(0, ...readdir(path.join(__dirname, "../data/mod_ideas"))
    .filter((p) => p.endsWith(".json"))
    .map((p) => parseInt(p.substring(0, p.length - 5))),
  );
}

async function addReactions(message: Discord.Message) {
  await message.react(config.emojis.upvote);
  await message.react(config.emojis.abstain);
  await message.react(config.emojis.downvote);
}