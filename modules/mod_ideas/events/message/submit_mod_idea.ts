import Discord from "discord.js";
import { bot, guild } from "../../../../src";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as util from "../../../../src/util";
import ModIdea from "../../src/mod_idea";

bot.on("message", async (message: Discord.Message) => {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.modules.mod_ideas.channels.submit) return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith("c/") && util.getPermission(message.member) >= CommandPermission.Administrator) return;

  const ideamsg = ModIdea.create(message).send(config.modules.mod_ideas.channels.list, true, true);
  message.react(config.emojis.success);
  embeds.success(message, `Your mod idea has been submitted.\nClick [here](${(await ideamsg).url}) to view it.`, 5);
});