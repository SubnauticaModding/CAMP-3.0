/* // TODO
import Discord from "discord.js";
import { Account } from "../..";
import { commands } from "../../../../src";
import Command from "../../../../src/command";
import CommandPermission from "../../../../src/command_permission";
import * as data from "../../../../src/data";

commands.push(new Command({
  name: "newlink",
  description: "Links a user's accounts.",
  usage: "<Discord ID | Mention | Tag | null> <NexusMods ID/Username | Game/ModID | null> <GitHub Username | null>",
  getPermission: () => CommandPermission.Moderator,

  execute: async (message: Discord.Message, args: string[]) => {
    const accounts = data.read("account_linking/accounts", [] as Account[]);
    const validAccounts: Account[] = [];
    for (const account of accounts) {
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
        if (account.nexus.id == args[1] || account.nexus.name == args[1]) {
          validAccounts.push(account);
          continue;
        }
      }

      if (account.github && account.github == args[2]) {
        validAccounts.push(account);
        continue;
      }
    }

    const uniqueAccounts = new Set(accounts);
    if (uniqueAccounts.size != 0) {
      await message.channel.send(`There ${uniqueAccounts.size == 1 ? "is" : "are"} already ${uniqueAccounts.size} user${uniqueAccounts.size == 1 ? "" : "s"} matching your query:`);
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
    }

    if (uniqueAccounts.size > 1) await message.channel.send(`Found ${uniqueAccounts.size} users matching your query.`);

  },
}));
*/