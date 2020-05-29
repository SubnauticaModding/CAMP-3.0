import Discord from "discord.js";

import { guild } from "../../..";
import * as commands from "../../commands";
import config from "../../config";
import CommandPermission from "../../data_types/command_permission";
import * as embeds from "../../embeds";
import * as util from "../../util";

export default async function (message: Discord.Message) {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith("c/") && !message.content.toLowerCase().startsWith("z/")) return;

  if (message.content.toLowerCase().startsWith("z/")) {
    const reminderMessage = message.channel.send(new Discord.MessageEmbed({
      title: "Reminder",
      description: "The prefix for the Mod Ideas bot has changed. The new prefix is `c/`.",
      color: "FEFEFE"
    }));
    message.content = "c" + message.content.substr(1);

    reminderMessage.then((r) => {
      setTimeout(() => {
        r.delete({ reason: "Prefix change reminder message deleted." });
      }, 10000);
    })
  }

  const args = message.content.split(/[ \n\r]+/g);
  const cmd = args.shift()?.substr(2);

  for (var i = 0; i < 10; i++) {
    args[i] = args[i] ?? "";
  }

  if (!cmd) return;

  for (const commandType of Object.values(commands)) {
    const command = new commandType();
    // @ts-ignore 2345 - Argument of type 'string' is not assignable to parameter of type 'never'.
    if (command.name == cmd || command.aliases?.includes(cmd)) {
      if (util.getPermission(message.member) >= command.getPermission(message)) {
        command.execute(message, args);
      } else if (command.getPermission(message) == CommandPermission.Developer) {
        embeds.error(message, "You don't have permission to execute this command.\nThis command may only be used by <@183249892712513536>.");
      } else {
        var toSay = "You don't have permission to execute this command.";
        const roles: string[] = [];
        for (var permission in config.permissions) {
          // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '{ 1: string, 2:string, ... }'
          if (parseInt(permission) >= command.permission) roles.push(`<@&${config.permissions[permission]}>`);
        }

        if (roles.length == 1) {
          toSay += `\nIn order to execute this command, you need the following role: ${roles[0]}.`;
        } else if (roles.length > 1) {
          toSay += "\nIn order to execute this command, you need one of the following roles: ";
          const lastRole = roles.pop();
          toSay += roles.join(", ");
          toSay += `or ${lastRole}.`;
        }

        embeds.error(message, toSay);
      }
    }
  }
}
