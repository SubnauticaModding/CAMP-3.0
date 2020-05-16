import Discord from "discord.js";

import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdea from "../data_types/mod_idea";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";

export default class implements Command {
  name = "remove";
  aliases = ["deny", "invalid"];
  description = `Removes a mod idea and moves it into <#${config.mod_ideas.removed_channel}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    //#region Argument checks 

    if (args[0].startsWith("#")) args[0] = args[0].substr(1);
    if (parseInt(args[0]).toString() != args[0]) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modidea = ModIdea.get(parseInt(args[0]));

    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    //#endregion

    const ideaID = args.shift();
    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Removed;
    modidea.specialComment = "";
    modidea.lastActor = message.author.id;
    modidea.comment = args.join(" ");

    (await modidea.getMessage())?.delete();
    modidea.update();
    const newIdeaMsg = modidea.send(config.mod_ideas.removed_channel, true, false);

    if (oldStatus == ModIdeaStatus.Removed)
      embeds.success(message, `Your changes to mod idea \`#${ideaID}\` have been applied.\nClick [here](${(await newIdeaMsg).url}) to view it.`)
    else
      embeds.success(message, `Mod idea \`#${ideaID}\` has been removed.\nClick [here](${(await newIdeaMsg).url}) to view it.`);
  }
}