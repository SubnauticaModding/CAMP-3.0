import Discord from "discord.js";

import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdea from "../data_types/mod_idea";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";

export default class implements Command {
  name = "duplicate";
  aliases = ["dupe", "copy"];
  description = `Removes a mod idea and moves it into <#${config.channels.ideas_removed}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    //#region Argument checks 

    if (args[0].startsWith("#")) args[0] = args[0].substr(1);
    if (parseInt(args[0]).toString() != args[0]) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modidea = ModIdea.get(parseInt(args[0]));

    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    if (args[1].startsWith("#")) args[1] = args[1].substr(1);
    if (parseInt(args[1]).toString() != args[1]) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the second argument.");

    const original = ModIdea.get(parseInt(args[1]));

    if (!original) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the second argument.");

    //#endregion

    const ideaID = args.shift();
    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Duplicate;
    modidea.specialComment = args.shift() ?? "";
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    (await modidea.getMessage())?.delete();
    modidea.update();
    const newIdeaMsg = modidea.send(config.channels.ideas_removed, true, false);

    if (oldStatus == ModIdeaStatus.Removed)
      embeds.success(message, `Your changes to mod idea \`#${ideaID}\` have been applied.\nClick [here](${(await newIdeaMsg).url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${ideaID}\` has been marked as a duplicate.\nClick [here](${(await newIdeaMsg).url}) to view it.`);
  }
}