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
  name: "new",
  aliases: ["relist"],
  description: `Removes the status of a mod idea and re-adds it to <#${config.modules.mod_ideas.channels.list}>.`,
  usage: "<#ID>",
  getPermission: () => CommandPermission.ModIdeasManager,
  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    // if (modidea.status == ModIdeaStatus.None) return embeds.error(message, `That mod idea is already in <#${config.channels.modideas.list}>.`);

    modidea.status = ModIdeaStatus.None;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = "";

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.list);
    ModIdea.addReactions(newIdeaMsg);

    embeds.success(message, `Mod idea \`#${modidea.id}\` has been re-added to <#${config.modules.mod_ideas.channels.list}>.\nClick [here](${newIdeaMsg.url}) to view it.`);
  },
}));