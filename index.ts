import Database from "better-sqlite3";
import * as Discord from "discord.js";
import { config as dotenv } from "dotenv";
import * as express from "express";
import { existsSync as folderExists, mkdirSync as makeFolder } from "fs";
import * as http from "http";
import { join as path } from "path";

import loadCommands from "./src/load_commands";
import { moduleEnabled } from "./src/modules";

dotenv();
if (!folderExists(path(__dirname, "data"))) makeFolder(path(__dirname, "data"));

const bot = new Discord.Client({ fetchAllMembers: true });
const commands = {};
const db = new Database("data/ideas.db");
const guild = () => bot.guilds.get("324207629784186882");
const web = express();

web.all('*', (_, res) => { res.sendStatus(200); });
web.listen(process.env.PORT || 3000);
bot.login(process.env.DISCORD_TOKEN);

bot.on("ready", () => {
  loadCommands();
});

bot.on("message", message => {
  if (!message.content.startsWith("c/")) return;
  if (message.author.bot) return;
});

bot.on("message", message => {
  if (!moduleEnabled("mod_ideas")) return;
  if (message.channel.id != "653004203823857665") return;
  if (message.content.startsWith("c/")) return;
})

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN || "subnauticamoddingbot"}.glitch.me/`);
}, 260000);

export { bot, commands, guild };