import dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";
import nexusmods from "@nexusmods/nexus-api";

import ModIdea from "./src/data_types/mod_idea";
import config from "./src/config";
import * as util from "./src/util";

import("./src/web_init");
console.log("Environment: " + config.environment);
console.log("Launching bot...");
util.ensureFolders(__dirname, "data", "mod_ideas");

export const bot = new Discord.Client({
  disableMentions: "everyone",
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
export var guild: Discord.Guild;
export var nexus: nexusmods;

(async () => {
  console.log("Creating nexusmods object...")
  nexus = await nexusmods.create(process.env.NEXUS_API_KEY ?? "", "SNModding-CAMP-Bot", `v${config.version}`, "Subnautica");
  console.log("Nexusmods object created");
})();

console.log("Loading events...");
import("./src/events");
console.log("Events loaded");

bot.login(process.env.DISCORD_TOKEN);

setInterval(() => {
  ModIdea.updateReportMessage();
}, 300000);

export function setGuild(g: Discord.Guild) {
  guild = g;
}