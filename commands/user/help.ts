import Discord from "discord.js";
import { commands, guild } from "../../src";
import Command from "../../src/command";
import CommandPermission from "../../src/command_permission";
import config from "../../src/config";
import * as util from "../../src/util";

commands.push(new Command({
  name: "help",
  description: `Shows a list of commands you can use.`,
  execute: async (message: Discord.Message) => {
    const embed = new Discord.MessageEmbed();
    embed.setColor("BLUE");
    embed.setAuthor(guild.me?.displayName, message.client.user?.displayAvatarURL());
    embed.setTitle("Commands List");
    embed.setDescription("_Arguments in <angle brackets> are required, and arguments in [square brackets] are optional._");
    embed.setFooter(`Bot created by AlexejheroYTB | v${config.version}`);

    const userPerm = util.getPermission(message.member);
    for (var cmdI in commands) {
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

    await util.wait(120);

    message.delete({ reason: "Command invocation message deleted." });
    helpMessage.delete({ reason: "Command reply message deleted." });
  },
}));