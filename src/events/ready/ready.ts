import { bot, setGuild } from "../../..";
import config from "../../config";
import ModIdea from "../../data_types/mod_idea";

export default async function () {
  console.log("Bot is ready.");
  var mainGuild = bot.guilds.cache.get(config.guild);
  if (!mainGuild) console.error("Main guild missing!");
  else setGuild(mainGuild);

  ModIdea.updateReportMessage();
}