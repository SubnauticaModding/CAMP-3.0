import Discord from "discord.js";

import { guild } from "../../..";
import config from "../../config";
import ModIdea from "../../data_types/mod_idea";

export var ignored_messages: string[] = [];

export default async function (message: Discord.Message | Discord.PartialMessage) {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.channels.ideas_list && message.channel.id != config.channels.ideas_released && message.channel.id != config.channels.ideas_removed) return;
  if (!message.author.bot) return;

  if (ignored_messages.includes(message.id)) {
    ignored_messages = ignored_messages.filter(x => x != message.id);
    return;
  }

  const modidea = ModIdea.getFromMessage(message);
  if (!modidea) return;

  modidea._deleted = true;
  modidea.update();
}
