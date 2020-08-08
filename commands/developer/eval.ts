import Discord from "discord.js";
import { commands } from "../../src";
import Command from "../../src/command";
import CommandPermission from "../../src/command_permission";

commands.push(new Command({
  name: "eval",
  hidden: true,
  getPermission: (message: Discord.Message) => CommandPermission.Developer,
  execute: (message: Discord.Message, args: string[]) => {
    eval(`(async(message)=>{${args.join(" ")}})(message);`);
  },
}));