import Discord from "discord.js";
import { nexus } from "../../..";
import Command from "../../command";
import CommandPermission from "../../command_permission";

export default class implements Command {
  name = "ratelimit";
  aliases = ["rl"];
  description = "Gets the number of remaining requests to the NexusMods API.";
  usage = "";
  hidden = true;
  getPermission = (message: Discord.Message) => CommandPermission.Developer;

  async execute(message: Discord.Message, args: string[]) {
    const rl = nexus.getRateLimits();
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Remaining Requests");
    embed.setColor(rl.daily <= 0 ? "RED" : "BLUE");
    embed.addField("Daily", rl.daily, true);
    embed.addField("Hourly", rl.hourly, true);
    message.channel.send(embed);
  }
}