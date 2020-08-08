import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser from "../../../../src/parser";

commands.push(new Command({
  name: "mim",
  aliases: ["modideasmanager"],
  description: `Gives or takes the <@&${config.permissions[CommandPermission.ModIdeasManager]}> role from a person.`,
  usage: "<member ID or @mention>",
  getPermission: (message: Discord.Message) => CommandPermission.Moderator,
  execute: async (message: Discord.Message, args: string[]) => {
    const author = await parser.member(args[0]);
    if (!author) return embeds.error(message, "Invalid arguments. Expected a valid member ID or @mention as the second argument.");

    if (author.user.bot) return embeds.error(message, "Invalid arguments. Expected a valid non-bot member ID or @mention as the second argument.");

    if (author.roles.cache.keyArray().filter(r => r == config.permissions[CommandPermission.ModIdeasManager]).length == 0) {
      try {
        await author.roles.add(config.permissions[CommandPermission.ModIdeasManager], `Added with the ${config.prefix}mim command by ${message.author.tag}`);
        embeds.success(message, `<@${author.id}> has received the <@&${config.permissions[CommandPermission.ModIdeasManager]}> role.`);
      } catch (e) {
        console.error(e);
        embeds.error(message, "An error has occurred. The bot probably doesn't have permission to edit the roles of that user or access the wanted role.");
      }
    } else {
      try {
        await author.roles.remove(config.permissions[CommandPermission.ModIdeasManager], `Removed with the ${config.prefix}mim command by ${message.author.tag}`);
        embeds.success(message, `<@${author.id}> has lost the <@&${config.permissions[CommandPermission.ModIdeasManager]}> role.`);
      } catch (e) {
        console.error(e);
        embeds.error(message, "An error has occurred. The bot probably doesn't have permission to edit the roles of that user or access the wanted role.");
      }
    }
  },
}));