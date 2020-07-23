require("dotenv").config();

import nexusmods from "@nexusmods/nexus-api";
import Discord from "discord.js";
import config from "./src/config";
import * as modfeed from "./src/mod_feed";
import ModIdea from "./src/mod_idea";

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
  modfeed.updateModFeeds();
}, 300000); // 5 minutes

setInterval(() => {
  ModIdea.updateReportMessage();
  ModIdea.removeBadIdeas();
}, 60000); // 1 minute

export function setGuild(g: Discord.Guild) {
  guild = g;
}

process.on('unhandledRejection', (reason, promise) => {
  console.log("Unhandled Rejection at: ", promise, "\nReason:", reason);
});