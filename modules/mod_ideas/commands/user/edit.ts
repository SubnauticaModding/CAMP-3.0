import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import { getPermission } from "../../../../src/util";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "edit",
  description: "Edits a mod idea.",
  usage: "<#ID> [new text]",
  getPermission: () => CommandPermission.User,
  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.author != message.author.id && getPermission(message.member) < CommandPermission.ModIdeasManager)
      return embeds.error(message, "That is not your mod idea!\nYou cannot edit someone else's mod idea.");
    if (modidea.status != ModIdeaStatus.None && getPermission(message.member) < CommandPermission.ModIdeasManager)
      return embeds.error(message, "Your mod idea has already been released/removed, so you cannot edit it.");

    args.shift();

    modidea.lastActor = message.author.id;
    modidea.text = args.join(" ");
    modidea.edited = true;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.list);

    embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
  },
}));