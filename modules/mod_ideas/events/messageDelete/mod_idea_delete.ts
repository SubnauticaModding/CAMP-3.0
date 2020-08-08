import Discord from "discord.js";
import { bot, guild } from "../../../../src";
import config from "../../../../src/config";
import ModIdea from "../../src/mod_idea";

const ignored_messages: string[] = [];
export default ignored_messages;

bot.on("messageDelete", async (message: Discord.Message | Discord.PartialMessage) => {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.modules.mod_ideas.channels.list && message.channel.id != config.modules.mod_ideas.channels.released && message.channel.id != config.modules.mod_ideas.channels.removed) return;
  if (!message.author.bot) return;

  if (ignored_messages.includes(message.id)) {
    ignored_messages.splice(ignored_messages.indexOf(message.id), 1);
    return;
  }

  const modidea = ModIdea.getFromMessage(message);
  if (!modidea) return;

  modidea._deleted = true;
  modidea.update();
});