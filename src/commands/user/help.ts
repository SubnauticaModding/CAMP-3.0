import Discord from "discord.js";

import * as commands from "..";
import { guild } from "../../..";
import config from "../../config";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import * as util from "../../util";

export default class implements Command {
  name = "help";
  aliases = [];
  description = `Shows a list of commands you can use.`;
  usage = "";
  permission = CommandPermission.User;

  async execute(message: Discord.Message, args: string[]) {
    const embed = new Discord.MessageEmbed();
    embed.setColor("BLUE");
    embed.setAuthor(guild.me?.displayName, message.client.user?.displayAvatarURL());
    embed.setTitle("Commands List");
    embed.setDescription("Arguments in <angle brackets> are required, and arguments in [square brackets] are optional.");
    embed.setFooter("Bot created by AlexejheroYTB | v3.0.0");

    const userPerm = util.getPermission(message.member);
    for (var cmdI in commands) {
      // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
      const command = new commands[cmdI]() as Command;
      if (userPerm >= command.permission) {
        var toAdd = `${command.description}`;

        if (command.aliases && command.aliases.length > 0) {
          toAdd += "\n• Aliases: ";
          toAdd += command.aliases.map(a => `\`c/${a}\``).join(", ");
        }
        if (command.permission != CommandPermission.User) {
          toAdd += "\n• Required Permission: ";
          if (command.permission == CommandPermission.Developer) toAdd += "Developer";
          // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
          else toAdd += `>= <@&${config.permissions[command.permission.toString()]}>`
        }

        embed.addField(`c/${command.name} ${command.usage}`, toAdd.trim());
      }
    }

    const helpMessage = await message.channel.send(embed);

    await util.wait(120);

    message.delete();
    helpMessage.delete();
  }
}