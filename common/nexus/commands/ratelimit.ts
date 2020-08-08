import Discord from "discord.js";
import { nexus } from "..";
import { commands } from "../../../src";
import Command from "../../../src/command";
import CommandPermission from "../../../src/command_permission";

commands.push(new Command({
  name: "ratelimit",
  aliases: ["rl"],
  hidden: true,
  getPermission: () => CommandPermission.Developer,
  execute: async (message: Discord.Message) => {
    const rl = nexus.getRateLimits();
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Remaining Requests");
    embed.setColor(rl.daily <= 0 ? "RED" : "BLUE");
    embed.addField("Daily", rl.daily, true);
    embed.addField("Hourly", rl.hourly, true);
    message.channel.send(embed);
  }
}));