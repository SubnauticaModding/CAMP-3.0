import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";
import config from "../../config";
import * as embeds from "../../embeds";
import ModIdeaStatus from "../../mod_idea_status";
import * as parser from "../../parser";

export default class implements Command {
  name = "remove";
  aliases = ["deny", "invalid"];
  description = `Removes a mod idea and moves it into <#${config.channels.modideas.removed}>.`;
  usage = "<#ID> [comment]";
  getPermission = (message: Discord.Message) => CommandPermission.ModIdeasManager;

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
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.modideas.removed);

    if (oldStatus == ModIdeaStatus.Removed)
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${modidea.id}\` has been removed.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}