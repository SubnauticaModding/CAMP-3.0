import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";
import config from "../../config";
import * as embeds from "../../embeds";
import ModIdeaStatus from "../../mod_idea_status";
import * as parser from "../../parser";
import { getPermission } from "../../util";

export default class implements Command {
  name = "attach";
  aliases = [];
  description = "Adds, replaces or removes an attachment from a mod idea.";
  usage = "<#ID> [attachment link]";
  getPermission = (message: Discord.Message) => CommandPermission.User;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.author != message.author.id && getPermission(message.member) == CommandPermission.User)
      return embeds.error(message, "That is not your mod idea!\nYou cannot edit someone else's mod idea.");
    if (modidea.status != ModIdeaStatus.None && getPermission(message.member) == CommandPermission.User)
      return embeds.error(message, "Your mod idea has already been released/removed, so you cannot edit it.");

    args.shift();

    modidea.lastActor = message.author.id;
    modidea.image = args.join(" ");
    modidea.edited = true;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.modideas.list);

    embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
  }
}