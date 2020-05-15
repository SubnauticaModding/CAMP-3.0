import Discord from "discord.js";
import dotenv from "dotenv";

import config from "./src/config";
import * as mod_ideas from "./src/mod_ideas";
import * as util from "./src/util";
import web_init from "./src/web_init";

dotenv.config();
web_init();
console.log("Environment: " + config.environment);
console.log("Launching bot...");
util.ensureFolders(__dirname, "data", "mod_ideas");

export const bot = new Discord.Client({
  disableMentions: "everyone"
});
export var guild: Discord.Guild;

bot.login(process.env.DISCORD_TOKEN);
bot.on("ready", () => {
  console.log("Bot is ready.");
  var mainGuild = bot.guilds.cache.get(config.guild);
  if (!mainGuild) console.error("Main guild missing!");
  else guild = mainGuild;
});

bot.on("message", (message) => {
  if (message.channel.id !== config.mod_ideas.submit_channel) return;
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix)) return;

  mod_ideas.createModIdea(message);
});
