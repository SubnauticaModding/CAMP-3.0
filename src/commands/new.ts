import Discord from "discord.js";

import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdea from "../data_types/mod_idea";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";

export default class implements Command {
  name = "new";
  aliases = ["relist"];
  description = `Removes the status of a mod idea and re-adds it to <#${config.channels.ideas_list}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    if (args[0].startsWith("#")) args[0] = args[0].substr(1);
    if (parseInt(args[0]).toString() != args[0]) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modidea = ModIdea.get(parseInt(args[0]));

    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (modidea.status == ModIdeaStatus.None) return embeds.error(message, `That mod idea is already in <#${config.channels.ideas_list}>.`);

    modidea.status = ModIdeaStatus.None;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = "";

    (await modidea.getMessage())?.delete();
    modidea.update();
    const newIdeaMsg = modidea.send(config.channels.ideas_list, true, true);

    embeds.success(message, `Mod idea \`#${args[0]}\` has been re-added to <#${config.channels.ideas_list}>.\nClick [here](${(await newIdeaMsg).url}) to view it.`);
  }
}