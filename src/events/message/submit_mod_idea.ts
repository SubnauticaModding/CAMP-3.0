import Discord from "discord.js";

import { guild } from "../../..";
import config from "../../config";
import CommandPermission from "../../data_types/command_permission";
import ModIdea from "../../data_types/mod_idea";
import * as embeds from "../../embeds";
import * as util from "../../util";

export default async function (message: Discord.Message) {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.channels.ideas_submit) return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith("c/") && util.getPermission(message.member) >= CommandPermission.Administrator) return;

  const ideamsg = ModIdea.create(message).send(config.channels.ideas_list, true, true);
  message.react(config.emojis.success);
  embeds.success(message, `Your mod idea has been submitted.\nClick [here](${(await ideamsg).url}) to view it.`, 5);
}
