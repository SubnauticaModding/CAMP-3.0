import { exec } from "child_process";
import { commands } from "../../src/";
import Command from "../../src/command";
import CommandPermission from "../../src/command_permission";

commands.push(new Command({
  name: "cmd",
  aliases: ["command", "shell"],
  description: "Executes a shell command.",
  usage: "<command>",
  hidden: true,
  getPermission: () => CommandPermission.Developer,
  execute: (_, args: string[]) => {
    exec(args.join(" "), (error, stdout, stderr) => {
      if (error) console.error(error.message);
      else if (stderr) console.error(stderr);
      else console.log(stdout);
    });
  },
}));