import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";
import config from "../../config";
import * as embeds from "../../embeds";
import * as parser from "../../parser";

export default class implements Command {
  name = "comment";
  aliases = [];
  description = "Adds, replaces or removes a comment on a mod idea.";
  usage = "<#ID> [comment]";
  getPermission = (message: Discord.Message) => CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    args.shift();

    modidea.comment = args.join(" ");

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(modidea.channel ?? config.channels.modideas.list);

    embeds.success(message, `Your comment to mod idea \`#${modidea.id}\` has been applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}