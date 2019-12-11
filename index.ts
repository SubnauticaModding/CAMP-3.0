import * as Discord from "discord.js";
import { config as dotenv } from "dotenv";
import express from "express";
import { existsSync as folderExists, mkdirSync as makeFolder } from "fs";
import * as http from "http";
import { join as path } from "path";

import config from "./config.json";
import loadCommands from "./src/loadCommands";
import { createModIdea, editModIdea, getModIdeaFromMessage, sendModIdea, updateModIdea } from "./src/modIdeas.js";
import { getOperation, getOperations, startOperation, stopOperation } from "./src/operations.js";
import { wait } from "./src/util.js";

dotenv();
if (!folderExists(path(__dirname, "data"))) { makeFolder(path(__dirname, "data")); }
if (!folderExists(path(__dirname, "data/modideas"))) { makeFolder(path(__dirname, "data/modideas")); }

const bot = new Discord.Client({ fetchAllMembers: true });
const commands: any = {};
const guild = () => {
  const g = bot.guilds.get(config.DISCORD.GUILD);
  if (!g) throw new Error("Main guild missing!");
  return g;
};
const web = express();

bot.login(process.env.DISCORD_TOKEN);
web.all("*", (_, res) => { res.sendStatus(200); });
web.listen(process.env.PORT);

bot.on("ready", () => {
  loadCommands();
  console.log("Logged in!");
});

bot.on("message", (message) => {
  if (message.channel.type !== "text") return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.PREFIX)) return;
  if (message.channel.id === config.CHANNELS.IDEAS_SUBMIT) return;
});

bot.on("message", async (message) => {
  if (message.channel.type !== "text") return;
  if (message.author.bot) return;
  if (message.content.startsWith(config.PREFIX)) return;
  if (message.channel.id !== config.CHANNELS.IDEAS_SUBMIT) return;

  await sendModIdea(createModIdea(message), config.CHANNELS.IDEAS_LIST, true);
  await message.react(config.EMOJIS.SUCCESS);
  await wait(3);
  message.delete();
});

bot.on("messageReactionAdd", async (mr, user) => {
  if (bot.user.id === user.id) return;
  const idea = getModIdeaFromMessage(mr.message);
  if (!idea) return;

  const operation = await getOperation(mr.message);
  if (!operation) {
    switch (mr.emoji.id) {
      case config.EMOJIS.VOTE.UPVOTE:
        idea.rating.likes = idea.rating.likes.filter((e: string) => e !== user.id);
        idea.rating.dislikes = idea.rating.dislikes.filter((e: string) => e !== user.id);
        idea.rating.likes.push(user.id);
        await editModIdea(updateModIdea(idea), mr.message);
        mr.remove(user);
        break;
      case config.EMOJIS.VOTE.ABSTAIN:
        idea.rating.likes = idea.rating.likes.filter((e: string) => e !== user.id);
        idea.rating.dislikes = idea.rating.dislikes.filter((e: string) => e !== user.id);
        await editModIdea(updateModIdea(idea), mr.message);
        mr.remove(user);
        break;
      case config.EMOJIS.VOTE.DOWNVOTE:
        idea.rating.likes = idea.rating.likes.filter((e: string) => e !== user.id);
        idea.rating.dislikes = idea.rating.dislikes.filter((e: string) => e !== user.id);
        idea.rating.dislikes.push(user.id);
        await editModIdea(updateModIdea(idea), mr.message);
        mr.remove(user);
        break;
      default:
        switch (mr.emoji.toString()) {
          case config.EMOJIS.VOTE.EDIT:
            if (await getOperation(user)) {
              mr.remove(user);
              return;
            }
            await startOperation(user, mr.message);
            break;
          default:
            mr.remove(user);
        }
    }
  } else {
    if (user.id !== operation.user) mr.remove(user);

    switch (mr.emoji.toString()) {
      case config.EMOJIS.EDIT.APPROVE:
        break;
      case config.EMOJIS.EDIT.REMOVE:
        break;
      case config.EMOJIS.EDIT.DUPLICATE:
        break;
      case config.EMOJIS.EDIT.CANCEL:
        stopOperation(user, mr.message);
        break;
      default:
        mr.remove(user);
    }
  }
});

// CODE FROM https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
bot.on("raw", (packet: any) => {
  // We don't want this to run on unrelated packets
  if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t)) { return; }
  // Grab the channel to check the message from
  const channel = bot.channels.get(packet.d.channel_id) as Discord.TextChannel;
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel.messages.has(packet.d.message_id)) { return; }
  // Since we have confirmed the message is not cached, let's fetch it
  channel.fetchMessage(packet.d.message_id).then((message) => {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.get(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction) { reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id) as Discord.User); }
    // Check which type of event it is before emitting
    if (packet.t === "MESSAGE_REACTION_ADD") {
      bot.emit("messageReactionAdd", reaction, bot.users.get(packet.d.user_id));
    }
    if (packet.t === "MESSAGE_REACTION_REMOVE") {
      bot.emit("messageReactionRemove", reaction, bot.users.get(packet.d.user_id));
    }
  });
});

setInterval(async () => {
  if (!bot.status) {
    for (const operation of await getOperations()) {
      if (operation.time < Date.now()) {
        stopOperation(operation.user, operation.message);
      }
    }
  }
}, 1000);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 260000);

export { bot, commands, guild };
