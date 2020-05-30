import Discord from "discord.js";

import config from "../../config";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import ModIdeaStatus from "../../data_types/mod_idea_status";
import * as embeds from "../../embeds";
import * as parser from "../../parser";

export default class implements Command {
  name = "duplicate";
  aliases = ["dupe", "copy"];
  description = `Marks a mod idea as a duplicate of another mod idea and moves it into <#${config.channels.modideas.removed}>.`;
  usage = "<duplicate #ID> <original #ID> [-f] [comment]";
  getPermission = (message: Discord.Message) => CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    const dupe = parser.modIdea(args[0]);
    if (!dupe) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const orig = parser.modIdea(args[1]);
    if (!orig) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the second argument.");

    if (dupe.id == orig.id) return embeds.error(message, "Invalid arguments. Expected two different mod idea IDs as the first and second parameters.");

    if (dupe.time < orig.time && args[2] != "-f") {
      return embeds.warn(message, "You are trying to mark an older mod idea as a duplicate of a newer mod idea.\nUsually, you should do it the other way around.\n_If you're sure you want to do this, run this command with the `-f` parameter after the second mod idea ID._", 20);
    }

    if (orig.status == ModIdeaStatus.Released && args[2] != "-f") {
      return embeds.warn(message, "You are trying to mark a mod idea as a duplicate of a released mod idea.\nUsually, in this case, you'd want to remove the duplicate mod idea.\n_If you're sure you want to do this, run this command with the `-f` parameter after the second mod idea ID._", 20);
    }

    if ((orig.status == ModIdeaStatus.Removed || orig.status == ModIdeaStatus.Duplicate || orig.status == ModIdeaStatus.Deleted) && args[2] != "-f") {
      return embeds.warn(message, "You are trying to mark a mod idea as a duplicate of a removed mod idea.\nUsually, in this case, you'd want to remove the duplicate mod idea.\n_If you're sure you want to do this, run this command with the `-f` parameter after the second mod idea ID._", 20);
    }

    args.shift();
    args.shift();

    const oldStatus = dupe.status;

    dupe.status = ModIdeaStatus.Duplicate;
    dupe.specialComment = orig.id.toString();
    dupe.lastActor = message.author.id;
    dupe.comment = args[0] == "-f" ? args.join(" ").substr(3) : args.join(" ");

    dupe.update();
    const newIdeaMsg = await dupe.sendOrEdit(config.channels.modideas.removed);

    if (oldStatus == ModIdeaStatus.Duplicate) {
      if ((dupe.time < orig.time || orig.status != ModIdeaStatus.None) && args[0] == "-f")
        embeds.success(message, `Your changes to mod idea \`#${dupe.id}\` have been **forcefully** applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
      else
        embeds.success(message, `Your changes to mod idea \`#${dupe.id}\` have been applied.\nClick [here](${newIdeaMsg.url}) to view it.`);
    } else {
      if ((dupe.time < orig.time || orig.status != ModIdeaStatus.None) && args[0] == "-f")
        embeds.success(message, `Mod idea \`#${dupe.id}\` has been **forcefully** marked as a duplicate of \`#${orig.id}\`.\nClick [here](${newIdeaMsg.url}) to view it.`);
      else
        embeds.success(message, `Mod idea \`#${dupe.id}\` has been marked as a duplicate of \`#${orig.id}\`.\nClick [here](${newIdeaMsg.url}) to view it.`);
    }
  }
}