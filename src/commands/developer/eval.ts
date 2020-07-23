import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";

export default class implements Command {
  name = "eval";
  aliases = [];
  description = "Executes custom JavaScript code.";
  usage = "<JS code>";
  hidden = true;
  getPermission = (message: Discord.Message) => CommandPermission.Developer;

  async execute(message: Discord.Message, args: string[]) {
    eval(`(async(message)=>{${args.join(" ")}})(message);`);
  }
}