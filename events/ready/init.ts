// import ModIdea from "../../mod_idea"; // TODO
import { bot, setGuild } from "../../src";
import config from "../../src/config";

bot.on("ready", async () => {
  console.log("Bot is ready.");
  var mainGuild = bot.guilds.cache.get(config.guild);
  if (!mainGuild) console.error("Main guild missing!");
  else setGuild(mainGuild);

  // ModIdea.updateReportMessage();
});