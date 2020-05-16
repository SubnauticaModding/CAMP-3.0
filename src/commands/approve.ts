import Discord from "discord.js";

import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";
import * as parser from "../parser";

export default class implements Command {
  name = "approve";
  aliases = ["release", "released"];
  description = `Marks a mod idea as released and moves it into <#${config.channels.ideas_released}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modinfo = await parser.nexusLink(args[1]);
    if (!modinfo) return embeds.error(message, "Invalid arguments. Expected a valid NexusMods link as the second argument.");
    if (!modinfo.available || modinfo.status != "published") return embeds.error(message, `Invalid mod. Mod \`${modinfo.domain_name}/${modinfo.mod_id}\` is not available.`);

    args.shift();
    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Released;
    modidea.specialComment = `https://nexusmods.com/${modinfo.domain_name}/mods/${modinfo.mod_id}`;
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.channels.ideas_released);

    if (oldStatus == ModIdeaStatus.Released)
      embeds.success(message, `Your changes to mod idea \`#${modidea}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${modidea}\` has been marked as released.\nClick [here](${newIdeaMsg.url}) to view it.`);
  }
}