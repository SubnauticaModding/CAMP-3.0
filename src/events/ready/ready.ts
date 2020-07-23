import { bot, setGuild } from "../../..";
import config from "../../config";
import * as modfeed from "../../mod_feed";
import ModIdea from "../../mod_idea";

export default async function () {
  console.log("Bot is ready.");
  var mainGuild = bot.guilds.cache.get(config.guild);
  if (!mainGuild) console.error("Main guild missing!");
  else setGuild(mainGuild);

  ModIdea.updateReportMessage();
  modfeed.updateModFeeds();
}