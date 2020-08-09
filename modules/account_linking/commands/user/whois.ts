import Discord from "discord.js";
import { Account, NexusAccount } from "../..";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import * as data from "../../../../src/data";

commands.push(new Command({
  name: "whois",
  aliases: ["whoami", "userinfo", "user", "memberinfo", "member"],
  description: "Tells you who the specified user is on other platforms.",
  usage: "[Discord, NexusMods or GitHub identifier]",

  execute: async (message: Discord.Message, args: string[]) => {
    var arg = message.content.substr(message.content.split(/[ \n\r]+/g)[0].length).trim();
    if (!arg) arg = message.author.id;

    const accounts = data.read("account_linking/accounts", [] as Account[], true);
    const validAccounts: Account[] = [];
    a: for (const account of accounts) {
      if (!account.discord && !account.github || !account.discord && !account.nexus || !account.github && !account.nexus) continue;

      if (account.discord) {
        for (const discord of account.discord) {
          if (arg == discord) {
            validAccounts.push(account);
            continue a;
          }

          if (message.mentions.members?.first()?.id == discord) {
            validAccounts.push(account);
            continue a;
          }

          const members = await message.guild?.members.fetch();
          if (members) {
            const member = members.find((v) => v.user.tag == arg);
            if (member && member.id == discord) {
              validAccounts.push(account);
              continue a;
            }
          }
        }
      }

      if (account.nexus) {
        for (const nexus of account.nexus) {
          if (nexus.id == arg || nexus.name == arg) {
            validAccounts.push(account);
            continue a;
          }
        }
      }

      if (account.github) {
        for (const github of account.github) {
          if (github == arg) {
            validAccounts.push(account);
            continue a;
          }
        }
      }
    }

    const uniqueAccounts = new Set(validAccounts);
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
      embed.addField("Discord", account.discord ? getDiscord(account.discord) : "_Not linked_", true);
      embed.addField("NexusMods", account.nexus ? getNexus(account.nexus) : "_Not linked_", true);
      embed.addField("GitHub", account.github ? getGithub(account.github) : "_Not linked_", true);
      embed.setFooter("Missing or outdated information? Contact @AlexejheroYTB#1636.")
      await message.channel.send(embed);
    }
  },
}));

function getDiscord(arr: string[]) {
  var result = "";
  for (const v of arr) {
    result += `<:discord:741753472562626560> <@${v}>\n`;
  }
  return result;
}

function getNexus(arr: NexusAccount[]) {
  var result = "";
  for (const v of arr) {
    result += `<:nexusmods:741753914268975224> [${v.name}](https://www.nexusmods.com/subnautica/users/${v.id})\n`;
  }
  return result;
}

function getGithub(arr: string[]) {
  var result = "";
  for (const v of arr) {
    result += `<:github:741753188851384390> [${v}](https://github.com/${v})`;
  }
  return result;
}