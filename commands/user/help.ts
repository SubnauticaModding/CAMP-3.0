import Discord from "discord.js";
import { commands, guild } from "../../src";
import Command from "../../src/command";
import CommandPermission from "../../src/command_permission";
import config from "../../src/config";
import * as util from "../../src/util";

commands.push(new Command({
  name: "help",
  description: `Shows a list of commands you can use.`,
  usage: "[permission level] [-nodelete]",

  execute: async (message, args) => {
    const embed = new Discord.MessageEmbed();
    embed.setColor("BLUE");
    embed.setAuthor(guild.me?.displayName, message.client.user?.displayAvatarURL());
    embed.setTitle("Commands List");
    embed.setDescription("_Arguments in <angle brackets> are required, and arguments in [square brackets] are optional._");
    embed.setFooter(`Bot created by AlexejheroYTB | v${config.version}`);

    var userPerm = util.getPermission(message.member);

    if (Object.keys(CommandPermission).includes(args[0])) {
      // @ts-ignore 7015
      userPerm = Math.min(userPerm, CommandPermission[args[0]]);
    }

    for (var cmdI in commands.sort((a, b) => commandSort(a, b, message))) {
      const command = commands[cmdI];

      if (command.hidden == true) continue;

      if (userPerm >= command.getPermission(message)) {
        var toAdd = `${command.description}`;

        if (command.aliases && command.aliases.length > 0) {
          toAdd += "\n• Aliases: ";
          toAdd += command.aliases.map(a => `\`${config.prefix}${a}\``).join(", ");
        }
        if (command.getPermission(message) != CommandPermission.User) {
          toAdd += "\n• Required Permission: ";
          if (command.getPermission(message) == CommandPermission.Developer) toAdd += "Developer";
          // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
          else toAdd += `>= <@&${config.permissions[command.getPermission(message).toString()]}>`
        }

        embed.addField(`${config.prefix}${command.name} ${command.usage}`, toAdd.trim());
      }
    }

    const helpMessage = await message.channel.send(embed);

    if (args[0] == "-nodelete" || args[1] == "-nodelete") {
      message.delete({ reason: "Command invocation message deleted." });
      return;
    }

    await util.wait(120);

    message.delete({ reason: "Command invocation message deleted." });
    helpMessage.delete({ reason: "Command reply message deleted." });
  },
}));

function commandSort(a: Command, b: Command, message: Discord.Message) {
  if (a.getPermission(message) != b.getPermission(message)) return a.getPermission(message) - b.getPermission(message);
  return a.name.localeCompare(b.name);
}