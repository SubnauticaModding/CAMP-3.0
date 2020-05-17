import Discord from "discord.js";

import config from "../../config";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import ModIdeaStatus from "../../data_types/mod_idea_status";
import * as embeds from "../../embeds";
import * as parser from "../../parser";

export default class implements Command {
  name = "ziraportapprove";
  aliases = ["zpa"];
  description = "";
  usage = "<#ID> <NexusMods link> [comment]";
  hidden = true;
  getPermission = (message: Discord.Message) => CommandPermission.Developer;

  async execute(message: Discord.Message, args: string[]) {
    const modidea = parser.modIdea(args[0]);
    if (!modidea) return embeds.error(message, "Invalid arguments. Expected a valid mod idea ID as the first argument.");

    const modinfo = await parser.nexusLink(args[1]);
    if (!modinfo) return embeds.error(message, "Invalid arguments. Expected a valid NexusMods link as the second argument.");

    args.shift();
    args.shift();

    modidea.status = ModIdeaStatus.Released;
    modidea.specialComment = `https://nexusmods.com/${modinfo.domain_name}/mods/${modinfo.mod_id}`;
    modidea.lastActor = "493359366381240341";

    modidea.update();
    await modidea.sendOrEdit(config.channels.ideas_released);

    embeds.success(message, "", 3);
  }
}