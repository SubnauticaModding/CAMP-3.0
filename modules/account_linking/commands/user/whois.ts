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
      if (Object.values(account).filter(x => !!x).length <= 1) continue;

      if (account.discord && !Array.isArray(account.discord)) account.discord = [account.discord];
      if (account.nexus && !Array.isArray(account.nexus)) account.nexus = [account.nexus];
      if (account.github && !Array.isArray(account.github)) account.github = [account.github];
      if (account.bitbucket && !Array.isArray(account.bitbucket)) account.bitbucket = [account.bitbucket];

      if (account.discord) {
        const members = await message.guild?.members.fetch();
        for (const discord of account.discord) {
          if (arg == discord) {
            validAccounts.push(account);
            continue a;
          }

          if (message.mentions.members?.first()?.id == discord) {
            validAccounts.push(account);
            continue a;
          }

          if (members) {
            const member = members.find((v) => v.user.tag == arg);
            if (member && member.id == discord) {
              validAccounts.push(account);
              continue a;
            }

            const member2 = members.find((v) => v.user.username == arg);
            if (member2 && member2.id == discord) {
              validAccounts.push(account);
              continue a;
            }

            const member3 = members.find((v) => v.displayName == arg);
            if (member3 && member3.id == discord) {
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

      if (account.bitbucket) {
        for (const bitbucket of account.bitbucket) {
          if (bitbucket == arg) {
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
      embed.setFooter("Missing or outdated information? Contact @AlexejheroYTB#1636.");
      message.channel.send(embed);
      return;
    }

    if (uniqueAccounts.size > 1) await message.channel.send(`Found ${uniqueAccounts.size} users matching your query.`);
    for (const account of uniqueAccounts) {
      const embed = new Discord.MessageEmbed();
      embed.setTitle("User Information");
      embed.setColor("BLUE");
      if (account.discord) embed.addField("Discord", getDiscord(account.discord as []), true);
      if (account.nexus) embed.addField("NexusMods", getNexus(account.nexus as []), true);
      if (account.github) embed.addField("GitHub", getGithub(account.github as []), true);
      if (account.bitbucket) embed.addField("BitBucket", getBitbucket(account.bitbucket as []), true);
      embed.setFooter("Missing or outdated information? Contact @AlexejheroYTB#1636.");
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
    result += `<:github:741753188851384390> [${v}](https://github.com/${v})\n`;
  }
  return result;
}

function getBitbucket(arr: string[]) {
  var result = "";
  for (const v of arr) {
    result += `<:bitbucket:741948675353346079> [${v}](https://bitbucket.org/${v})\n`;
  }
  return result;
}