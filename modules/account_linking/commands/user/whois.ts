import Discord from "discord.js";
import { Account } from "../..";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import * as data from "../../../../src/data";

commands.push(new Command({
  name: "whois",
  aliases: ["whoami", "userinfo", "user", "memberinfo", "member"],
  description: "Shows a user's linked accounts.",
  usage: "[Discord, NexusMods or GitHub identifier]",

  execute: async (message: Discord.Message, args: string[]) => {
    if (!args[0]) args[0] = message.author.id;

    const accounts = data.read("account_linking/accounts", [] as Account[], true);
    const validAccounts: Account[] = [];
    for (const account of accounts) {
      if (!account.discord && !account.github || !account.discord && !account.nexus || !account.github && !account.nexus) continue;

      if (account.discord) {
        if (args[0] == account.discord) {
          validAccounts.push(account);
          continue;
        }

        if (message.mentions.members?.first()?.id == account.discord) {
          validAccounts.push(account);
          continue;
        }

        const members = await message.guild?.members.fetch();
        if (members) {
          const member = members.find((v) => v.user.tag == args[0]);
          if (member && member.id == account.discord) {
            validAccounts.push(account);
            continue;
          }
        }
      }

      if (account.nexus) {
        if (account.nexus.id == args[0] || account.nexus.name == args[0]) {
          validAccounts.push(account);
          continue;
        }
      }

      if (account.github && account.github == args[0]) {
        validAccounts.push(account);
        continue;
      }
    }

    const uniqueAccounts = new Set(accounts);
    if (uniqueAccounts.size == 0) {
      const embed = new Discord.MessageEmbed();
      embed.setTitle("User Information");
      embed.setColor("RED");
      embed.setDescription("There is no information about this user.");
      message.channel.send(embed);
      return;
    }

    if (uniqueAccounts.size > 1) await message.channel.send(`Found ${uniqueAccounts.size} users matching your query.`);
    for (const account of uniqueAccounts) {
      const embed = new Discord.MessageEmbed();
      embed.setTitle("User Information");
      embed.setColor("BLUE");
      embed.addField("Discord", account.discord ? `<@${account.discord}>` : "_Not linked_", true);
      embed.addField("NexusMods", account.nexus ? `[${account.nexus.name}](https://www.nexusmods.com/subnautica/users/${account.nexus.id})` : "_Not linked_", true);
      embed.addField("GitHub", account.github ? `https://github.com/${account.github}` : "_Not linked_", true);
      embed.setFooter("Not accurate? Contact @AlexejheroYTB#1636.")
      await message.channel.send(embed);
    }
  },
}));
