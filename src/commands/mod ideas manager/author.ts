import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";
import config from "../../config";
import * as embeds from "../../embeds";
import * as parser from "../../parser";

export default class implements Command {
  name = "author";
  aliases = [];
  description = "Changes the author of a mod idea";
  usage = "<#ID> <member ID or @mention> [-f]";
  getPermission = (message: Discord.Message) => CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const author = await parser.member(args[1]);
    if (!author) return embeds.error(message, "Invalid arguments. Expected a valid member ID or @mention as the second argument.");

    if (author.user.id == modidea.author) return embeds.error(message, "That mod idea already has that author.");

    if (author.user.bot && args[2] != "-f") {
      return embeds.warn(message, "You are trying to change the author of a mod idea to a bot.\nUsually, you'd want to change it into a user.\n_If you're sure you want to do this, run this command with the `-f` parameter at the end._", 20);
    }

    args.shift();

    modidea.author = author.id;
    modidea.edited = true;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.modideas.list);

    if (author.user.bot && args[2] == "-f")
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been **forcefully** applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
    else
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}