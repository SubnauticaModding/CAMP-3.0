import Discord from "discord.js";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import config from "../../../../src/config";
import * as embeds from "../../../../src/embeds";
import * as parser2 from "../../src/mod_idea_parser";
import ModIdeaStatus from "../../src/mod_idea_status";

commands.push(new Command({
  name: "approve",
  aliases: ["release", "released"],
  description: `Marks a mod idea as released and moves it into <#${config.modules.mod_ideas.channels.released}>.`,
  usage: "<#ID> <NexusMods link> [comment]",
  getPermission: () => CommandPermission.ModIdeasManager,

  execute: async (message: Discord.Message, args: string[]) => {
    const modidea = parser2.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modinfo = await parser2.nexusLink(args[1]);
    if (!modinfo) return embeds.error(message, "Invalid arguments. Expected a valid NexusMods link as the second argument.");
    if (!modinfo.available || modinfo.status != "published") return embeds.error(message, `Invalid mod. Mod [\`${modinfo.domain_name}/${modinfo.mod_id}\`](https://nexusmods.com/${modinfo.domain_name}/mods/${modinfo.mod_id}) is not available.`);

    args.shift();
    args.shift();

    const oldStatus = modidea.status;

    modidea.status = ModIdeaStatus.Released;
    modidea.statusComment = `https://nexusmods.com/${modinfo.domain_name}/mods/${modinfo.mod_id}`;
    modidea.lastStatusUpdater = message.author.id;

    if (args.join(" ").trim()) {
      modidea.comment = args.join(" ");
      modidea.lastCommenterID = message.author.id;
    }

    modidea.update();
    const newIdeaMsg = await modidea.sendOrEdit(config.modules.mod_ideas.channels.released);

    if (oldStatus == ModIdeaStatus.Released)
      embeds.success(message, `Your comment on mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}) has been ${args.join(" ").trim() ? "updated" : "removed"}.`);
    else
      embeds.success(message, `Mod idea [\`#${modidea.id}\`](${newIdeaMsg.url}) has been marked as released at [\`${modinfo.domain_name}/${modinfo.mod_id}\`](https://nexusmods.com/${modinfo.domain_name}/mods/${modinfo.mod_id}).`);
  },
}));