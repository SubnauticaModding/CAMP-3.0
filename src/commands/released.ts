import Discord from "discord.js";

import { nexus, bot } from "../..";
import config from "../config";
import Command from "../data_types/command";
import CommandPermission from "../data_types/command_permission";
import ModIdeaStatus from "../data_types/mod_idea_status";
import * as embeds from "../embeds";
import * as mod_ideas from "../mod_ideas";

export default class implements Command {
  name = "released";
  aliases = ["approve", "release"];
  description = `Marks a mod idea as released and moves it into <#${config.mod_ideas.released_channel}>.`;
  permission = CommandPermission.ModIdeasManager;

  async execute(message: Discord.Message, args: string[]) {
    //#region Argument checks 

    if (args[0].startsWith("#")) args[0] = args[0].substr(1);
    if (parseInt(args[0]).toString() != args[0]) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modidea = mod_ideas.getModIdea(parseInt(args[0]));

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

    modidea.status = ModIdeaStatus.Released;
    modidea.specialComment = `https://nexusmods.com/${game}/mods/${id}`;

    const comment = args.join(" ");
    if (comment) {
      modidea.comment = comment;
    }

    if (modidea.channel && modidea.message) {
      const ideaChannel = await bot.channels.fetch(modidea.channel) as Discord.TextChannel;
      const ideaMsg = await ideaChannel.messages.fetch(modidea.message);
      ideaMsg.delete();
    }

    mod_ideas.updateModIdea(modidea);
    const newIdeaMsg = mod_ideas.sendModIdea(modidea, config.mod_ideas.released_channel, true, false);
    embeds.success(message, `Mod idea \`#${ideaID}\` has been marked as released.\nClick [here](${(await newIdeaMsg).url}) to view it.`);
  }
}