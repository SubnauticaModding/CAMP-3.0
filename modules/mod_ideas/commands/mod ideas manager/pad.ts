import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "pad",
  description: "Prevents automatic deletion of a mod idea.",
  usage: "<#ID>",
  aliases: ["prevautodel", "preventautodel", "preventautomaticdeletion"],
  getPermission: () => CommandPermission.Moderator,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.status != ModIdeaStatus.None)
      return embeds.error(message, "You cannot perform this action on a released/removed mod idea.");

    modidea.rating.preventDeletion = !modidea.rating.preventDeletion;
    modidea.rating.preventDeletionBy = message.author.id;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.list);

    embeds.success(message, `You have ${modidea.rating.preventDeletion ? "enabled" : "disabled"} deletion prevention for mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}).`);
  },
}));