import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser2 from "../../src/mod_idea_parser";

commands.push(new Command({
  name: "comment",
  description: "Adds, replaces or removes a comment on a mod idea.",
  usage: "<#ID> [comment]",
  getPermission: () => CommandPermission.ModIdeasManager,
  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    args.shift();

    modidea.comment = args.join(" ");
    modidea.lastCommenter = message.member?.displayName ?? "";

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(modidea.channel ?? config.modules.mod_ideas.channels.list);

    embeds.success(message, `Your comment to mod idea \`#${modidea.id}\` has been applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
  },
}));