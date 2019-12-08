import * as Discord from "discord.js";
import { config as dotenv } from "dotenv";
import express from "express";
import { existsSync as folderExists, mkdirSync as makeFolder } from "fs";
import * as http from "http";
import { join as path } from "path";

import config from "./config.json";
import loadCommands from "./src/loadCommands";
import { createModIdea, sendModIdea } from "./src/modIdeas.js";

dotenv();
if (!folderExists(path(__dirname, "data"))) { makeFolder(path(__dirname, "data")); }
if (!folderExists(path(__dirname, "data/modideas"))) { makeFolder(path(__dirname, "data/modideas")); }

const bot = new Discord.Client({ fetchAllMembers: true });
const commands: any = {};
const guild = () => {
  const g = bot.guilds.get(config.DISCORD.GUILD);
  if (g) { return g; }
  throw new Error("Main guild could not be found!");
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
  if (message.channel.type !== "text") { return; }
  if (message.author.bot) { return; }
  if (!message.content.startsWith(config.PREFIX)) { return; }
  if (message.channel.id === config.CHANNELS.IDEAS_SUBMIT) { return; }
});

bot.on("message", (message) => {
  if (message.channel.type !== "text") { return; }
  if (message.author.bot) { return; }
  if (message.content.startsWith(config.PREFIX)) { return; }
  if (message.channel.id !== config.CHANNELS.IDEAS_SUBMIT) { return; }

  sendModIdea(createModIdea(message), config.CHANNELS.IDEAS_LIST);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 260000);

export { bot, commands, guild };
