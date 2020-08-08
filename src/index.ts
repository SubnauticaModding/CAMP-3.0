require("dotenv").config(); // Loads .env to process.env

import Discord from "discord.js";
import path from "path";
import Command from "./command";
import config from "./config";
import { importAll } from "./util";

console.log("Environment: " + config.environment);
console.log("Launching bot...");

export const bot = new Discord.Client({
  disableMentions: "everyone",
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
export const commands: Command[] = [];
export var guild: Discord.Guild;

console.log("Loading events...");
importAll(path.join(__dirname, "../events"));
console.log("Events loaded");

bot.login(process.env.DISCORD_TOKEN);

export function setGuild(g: Discord.Guild) {
  guild = g;
}

process.on('unhandledRejection', (reason, promise) => {
  console.log("Unhandled Rejection at: ", promise, "\nReason:", reason);
});