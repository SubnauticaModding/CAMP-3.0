import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser from "../../../../src/parser";
import * as parser2 from "../../src/mod_idea_parser";

commands.push(new Command({
  name: "author",
  description: "Changes the author of a mod idea",
  usage: "<#ID> <member ID or @mention> [-f]",
  getPermission: () => CommandPermission.ModIdeasManager,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const author = await parser.member(args[1]);
    if (!author) return embeds.error(message, "Invalid arguments. Expected a valid member ID or @mention as the second argument.");

    if (author.user.id == modidea.author) return embeds.error(message, "That mod idea already has that author.");

    if (author.user.bot && args[2] != "-f") {
      return embeds.warn(message, "You are trying to change the author of a mod idea to a bot.\nUsually, you'd want to change it into a user.\n_If you're sure you want to do this, run this command with the `-f` parameter at the end._", 20);
    }

    args.shift();

    modidea.rating.likes = modidea.rating.likes.filter(f => f != author.id);
    modidea.rating.dislikes = modidea.rating.dislikes.filter(f => f != author.id);

    modidea.author = author.id;
    modidea.edited = true;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(modidea.channel ?? config.modules.mod_ideas.channels.list);

    if (author.user.bot && args[2] == "-f")
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been **forcefully** applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
    else
      embeds.success(message, `Your changes to mod idea \`#${modidea.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
  },
}));