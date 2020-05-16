import Discord from "discord.js";

import { nexus } from "../..";
import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdea from "../data_types/mod_idea";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";

export default class implements Command {
  name = "approve";
  aliases = ["release", "released"];
  description = `Marks a mod idea as released and moves it into <#${config.channels.ideas_released}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    //#region Argument checks 

    if (args[0].startsWith("#")) args[0] = args[0].substr(1);
    if (parseInt(args[0]).toString() != args[0]) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modidea = ModIdea.get(parseInt(args[0]));

    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const matches = [...(args[1] ?? "").matchAll(/https?:\/\/nexusmods.com\/(subnautica(?:belowzero)?)\/mods\/(\d+)/g)];

    if (matches.length != 1) return embeds.error(message, "Invalid arguments. Expected a valid NexusMods link as the second argument.");

    const game = matches[0][1];
    const id = matches[0][2];

    if ((game != "subnautica" && game != "subnauticabelowzero") || parseInt(id).toString() != id)
      return embeds.error(message, "Invalid arguments. Expected a valid NexusMods link as the second argument.");

    const modinfo = await nexus.getModInfo(parseInt(id), game);

    if (!modinfo.available || modinfo.status != "published") return embeds.error(message, `Invalid mod. Mod \`${game}/${id}\` is not available.`);

    //#endregion

    const ideaID = args[0];
    args.shift();
    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Released;
    modidea.specialComment = `https://nexusmods.com/${game}/mods/${id}`;
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    (await modidea.getMessage())?.delete();
    modidea.update();
    const newIdeaMsg = modidea.send(config.channels.ideas_released, true, false);

    if (oldStatus == ModIdeaStatus.Released)
      embeds.success(message, `Your changes to mod idea \`#${ideaID}\` have been applied.\nClick [here](${(await newIdeaMsg).url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${ideaID}\` has been marked as released.\nClick [here](${(await newIdeaMsg).url}) to view it.`);
  }
}