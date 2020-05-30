import Discord from "discord.js";
import config from "../../config";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import ModIdea from "../../data_types/mod_idea";
import ModIdeaStatus from "../../data_types/mod_idea_status";
import * as embeds from "../../embeds";
import * as parser from "../../parser";

export default class implements Command {
  name = "new";
  aliases = ["relist"];
  description = `Removes the status of a mod idea and re-adds it to <#${config.channels.modideas.list}>.`;
  usage = "<#ID>";
  getPermission = (message: Discord.Message) => CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    // if (modidea.status == ModIdeaStatus.None) return embeds.error(message, `That mod idea is already in <#${config.channels.modideas.list}>.`);

    modidea.status = ModIdeaStatus.None;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = "";

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.modideas.list);
    ModIdea.addReactions(newIdeaMsg);

    embeds.success(message, `Mod idea \`#${modidea.id}\` has been re-added to <#${config.channels.modideas.list}>.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}