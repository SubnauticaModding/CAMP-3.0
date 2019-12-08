import * as Discord from "discord.js";
import { config as dotenv } from "dotenv";
import * as express from "express";
import { existsSync as folderExists, mkdirSync as makeFolder } from "fs";
import * as http from "http";
import { join as path } from "path";

import CONSTS from "./src/consts";
import loadCommands from "./src/load_commands";

dotenv();
if (!folderExists(path(__dirname, "data"))) makeFolder(path(__dirname, "data"));

const bot = new Discord.Client({ fetchAllMembers: true });
const commands = {};
const guild = () => bot.guilds.get(CONSTS.DISCORD.GUILD);
const web = express();

bot.login(CONSTS.API.DISCORD_TOKEN);
web.all('*', (_, res) => { res.sendStatus(200); });
web.listen(CONSTS.WEBSITE.PORT);

bot.on("ready", () => {
  loadCommands();
});

bot.on("message", message => {
  if (message.channel.type != "text") return;
  if (message.author.bot) return;
  if (!message.content.startsWith(CONSTS.CONFIG.PREFIX)) return;
  if ((message.channel as Discord.TextChannel).topic.includes(CONSTS.FLAGS.SUBMIT_MOD_IDEAS_CHANNEL)) return;
});

bot.on("message", message => {
  if (message.channel.type != "text") return;
  if (message.author.bot) return;
  if (message.content.startsWith(CONSTS.CONFIG.PREFIX)) return;
  if (!(message.channel as Discord.TextChannel).topic.includes(CONSTS.FLAGS.SUBMIT_MOD_IDEAS_CHANNEL)) return;
})

setInterval(() => {
  http.get(`http://${CONSTS.WEBSITE.PROJECT_DOMAIN}.glitch.me/`);
}, 260000);

export { bot, commands, guild };