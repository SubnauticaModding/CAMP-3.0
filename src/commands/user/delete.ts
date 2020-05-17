import Discord from "discord.js";

import config from "../../config";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import ModIdeaStatus from "../../data_types/mod_idea_status";
import * as embeds from "../../embeds";
import * as parser from "../../parser";

export default class implements Command {
  name = "delete";
  aliases = [];
  description = `Deletes your mod idea and moves it into <#${config.channels.ideas_removed}>.`;
  usage = "<#ID> [comment]";
  getPermission = (message: Discord.Message) => CommandPermission.User;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.author != message.author.id) return embeds.error(message, "That is not your mod idea!\nYou cannot delete someone else's mod idea.");
    if (modidea.status != ModIdeaStatus.None && modidea.status != ModIdeaStatus.Deleted)
      return embeds.error(message, "Your mod idea has already been released/removed, so you cannot delete it.");

    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Deleted;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.ideas_removed);

    if (oldStatus == ModIdeaStatus.Deleted)
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${modidea.id}\` has been deleted.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}