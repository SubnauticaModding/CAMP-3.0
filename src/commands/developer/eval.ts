import Discord from "discord.js";

import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";

export default class implements Command {
  name = "eval";
  aliases = [];
  description = "";
  usage = "<JS code>";
  permission = CommandPermission.Developer;
  hidden = true;

  async execute(message: Discord.Message, args: string[]) {
    eval(`(async(message)=>{${args.join(" ")}})(message);`);
  }
}