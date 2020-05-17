import Discord from "discord.js";

import CommandPermission from "./command_permission";

export default interface Command {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  permission: CommandPermission;
  hidden?: boolean;
  execute(message: Discord.Message, args: string[]): void | Promise<void>;
}