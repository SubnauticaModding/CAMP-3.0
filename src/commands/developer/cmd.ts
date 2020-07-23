import { exec } from "child_process";
import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";

export default class implements Command {
  name = "cmd";
  aliases = ["command", "shell"];
  description = "Executes a shell command.";
  usage = "<command>";
  hidden = true;
  getPermission = (message: Discord.Message) => CommandPermission.Developer;

  async execute(message: Discord.Message, args: string[]) {
    exec(args.join(" "), (error, stdout, stderr) => {
      if (error) console.error(error.message);
      else if (stderr) console.error(stderr);
      else console.log(stdout);
    });
  }
}