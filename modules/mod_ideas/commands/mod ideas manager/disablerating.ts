import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import ModIdea from "../../src/mod_idea";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "disablerating",
  description: "Disables or enables ratings on a mod idea.",
  usage: "<#ID>",
  aliases: ["disableratings", "enablerating", "enableratings"],
  getPermission: () => CommandPermission.Moderator,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.status != ModIdeaStatus.None)
      return embeds.error(message, "You cannot modify the ratings of a released/removed mod idea.");

    modidea.rating.disabled = !modidea.rating.disabled;
    modidea.rating.disabledBy = message.author.id;

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.list);

    const modIdeaMessage = await modidea.getMessage();
    if (!modIdeaMessage) {
      embeds.warn(message, "That mod idea does not have a message.");
    } else {
      modIdeaMessage.reactions.removeAll();
      if (!modidea.rating.disabled) ModIdea.addReactions(modIdeaMessage);
    }

    embeds.success(message, `You have ${modidea.rating.disabled ? "disabled" : "enabled"} ratings for mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}).`);
  },
}));