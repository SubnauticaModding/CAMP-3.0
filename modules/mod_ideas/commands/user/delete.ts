import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "delete",
  description: `Deletes your mod idea and moves it into <#${config.modules.mod_ideas.channels.removed}>.`,
  usage: "<#ID> [comment]",
  getPermission: () => CommandPermission.User,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.author != message.author.id) return embeds.error(message, "That is not your mod idea!\nYou cannot delete someone else's mod idea.");
    if (modidea.status != ModIdeaStatus.None && modidea.status != ModIdeaStatus.Deleted)
      return embeds.error(message, "Your mod idea has already been released/removed, so you cannot delete it.");

    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Deleted;
    modidea.statusComment = "";
    modidea.lastStatusUpdater = message.author.id;
    modidea.comment = args.join(" ");
    modidea.lastCommenter = message.author.id;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.removed);

    if (oldStatus == ModIdeaStatus.Deleted)
      embeds.success(message, `Your comment on mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}) has been ${args.join(" ").trim() ? "updated" : "removed"}.`);
    else
      embeds.success(message, `You have deleted mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}).`);
  },
}));