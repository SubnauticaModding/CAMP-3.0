import Discord from "discord.js";

import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";

export default class implements Command {
  name = "eval";
  aliases = [];
  description = `Evaluates custom JavaScript code.`;
  usage = "<JS code>";
  permission = CommandPermission.Developer;

  async execute(message: Discord.Message, args: string[]) {
    eval(args.join(" "));
  }
}