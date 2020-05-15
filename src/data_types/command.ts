import Discord from "discord.js";

import CommandPermission from "./command_permission";

export default interface Command {
  name: string;
  aliases?: string[];
  description: string;
  permission: CommandPermission;
  execute(message: Discord.Message, args: string[]): Promise<void>;
}