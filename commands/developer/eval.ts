import { commands } from "../../src";
import Command from "../../src/command";
import CommandPermission from "../../src/command_permission";

commands.push(new Command({
  name: "eval",
  hidden: true,
  getPermission: () => CommandPermission.Developer,
  execute: (_, args: string[]) => {
    eval(`(async(message)=>{${args.join(" ")}})(message);`);
  },
}));