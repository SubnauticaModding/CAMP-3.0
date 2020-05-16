import Discord from "discord.js";

import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";
import * as parser from "../parser";

export default class implements Command {
  name = "remove";
  aliases = ["deny", "invalid", "delete"];
  description = `Removes a mod idea and moves it into <#${config.channels.ideas_removed}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Removed;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.ideas_removed);

    if (oldStatus == ModIdeaStatus.Removed)
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${modidea.id}\` has been removed.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}