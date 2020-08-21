import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import { getPermission } from "../../../../src/util";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "attach",
  description: "Adds, replaces or removes an attachment from a mod idea.",
  usage: "<#ID> [attachment link]",
  getPermission: () => CommandPermission.User,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.author != message.author.id && getPermission(message.member) == CommandPermission.User)
      return embeds.error(message, "That is not your mod idea!\nYou cannot add attachments to someone else's mod idea.");
    if (modidea.status != ModIdeaStatus.None && getPermission(message.member) == CommandPermission.User)
      return embeds.error(message, "Your mod idea has already been released/removed, so you cannot add attachments to it.");

    args.shift();

    if (!modidea.image?.trim() && !args.join(" ").trim())
      return embeds.error(message, "This mod idea has no attachment to remove.");

    const previousAttachment = modidea.image;

    modidea.image = args.join(" ");
    modidea.edited = true;
    modidea.imageAttachedBy = message.author.id;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.list);

    if (!modidea.image.trim())
      embeds.success(message, `You have removed the attachment on mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}).`);
    else if (previousAttachment?.trim())
      embeds.success(message, `You have updated the attachment on mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}).`);
    else
      embeds.success(message, `You have added an attachment to mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}).`);
  },
}));