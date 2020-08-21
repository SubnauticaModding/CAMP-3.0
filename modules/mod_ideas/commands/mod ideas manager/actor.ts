import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser from "../../../../src/parser";
import * as parser2 from "../../src/mod_idea_parser";

commands.push(new Command({
  name: "actor",
  description: "Changes the last status updater on a mod idea",
  usage: "<#ID> <member ID or @mention> [-f]",
  aliases: ["statusupdater"],
  getPermission: () => CommandPermission.Moderator,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const actor = await parser.member(args[1]);
    if (!actor) return embeds.error(message, "Invalid arguments. Expected a valid member ID or @mention as the second argument.");

    if (actor.user.id == modidea.author) return embeds.error(message, "That mod idea already has that status updater.");

    if (actor.user.bot && args[2] != "-f") {
      return embeds.warn(message, "You are trying to change the last status updater of a mod idea to a bot.\nUsually, you'd want to change it into a user.\n_If you're sure you want to do this, run this command with the `-f` parameter at the end._", 20);
    }

    args.shift();

    modidea.lastStatusUpdater = actor.id;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.list);

    if (actor.user.bot && args[2] == "-f")
      embeds.success(message, `Your change to mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}) has been **forcefully** applied.`);
    else
      embeds.success(message, `Your change to mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}) has been applied.`);
  },
}));