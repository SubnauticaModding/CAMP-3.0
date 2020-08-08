import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "remove",
  aliases: ["deny", "invalid"],
  description: `Removes a mod idea and moves it into <#${config.modules.mod_ideas.channels.removed}>.`,
  usage: "<#ID> [comment]",
  getPermission: () => CommandPermission.ModIdeasManager,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Removed;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.removed);

    if (oldStatus == ModIdeaStatus.Removed)
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${modidea.id}\` has been removed.\nClick [here](${newIdeaMsg.url}) to view it.`);
  },
}));