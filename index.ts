require("dotenv").config();

import Discord from "discord.js";
import nexusmods from "@nexusmods/nexus-api";

import ModIdea from "./src/data_types/mod_idea";
import config from "./src/config";
import * as modfeed from "./src/mod_feed";

import("./src/web_init");
import("./src/crosspost");
console.log("Environment: " + config.environment);
console.log("Launching bot...");

export const bot = new Discord.Client({
  disableMentions: "everyone",
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
export var guild: Discord.Guild;
export var nexus: nexusmods;

(async () => {
  console.log("Creating nexusmods object...")
  nexus = await nexusmods.create(process.env.NEXUS_API_KEY ?? "", "SNModding-CAMP-Bot", config.version, "subnautica");
  console.log("Nexusmods object created");
})();

console.log("Loading events...");
import("./src/events");
console.log("Events loaded");

bot.login(process.env.DISCORD_TOKEN);

setInterval(() => {
  ModIdea.updateReportMessage();
  modfeed.updateModFeeds();
}, 300000);

export function setGuild(g: Discord.Guild) {
  guild = g;
}