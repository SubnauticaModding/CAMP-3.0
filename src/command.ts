import Discord from "discord.js";
import CommandPermission from "./command_permission";

export default class Command {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  hidden?: boolean;
  getPermission: (message: Discord.Message) => CommandPermission;
  execute: (message: Discord.Message, args: string[]) => void | Promise<void>;

  constructor(data: {
    name: string,
    aliases?: string[],
    description?: string | undefined,
    usage?: string | undefined,
    hidden?: boolean | undefined,
    getPermission?: (message: Discord.Message) => CommandPermission,
    execute: (message: Discord.Message, args: string[]) => void | Promise<void>,
  }) {
    this.name = data.name;
    this.aliases = data.aliases ?? [];
    this.description = data.description ?? "";
    this.usage = data.usage ?? "";
    this.hidden = data.hidden;
    this.getPermission = data.getPermission ?? ((_) => CommandPermission.User);
    this.execute = data.execute;
  }
}