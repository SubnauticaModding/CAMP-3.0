import Discord from "discord.js";
import config from "../../config";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";

export default class implements Command {
  name = "about";
  aliases = ["info"];
  description = "Shows information about the bot.";
  usage = "";
  getPermission = (message: Discord.Message) => CommandPermission.User;

  async execute(message: Discord.Message, args: string[]) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bot Information");
    embed.setColor("BLUE");
    embed.addField("Created By", "<@183249892712513536>", true);
    embed.addField("Version", `v${config.version}`, true);
    embed.addField("Hosted On", "[glitch.com](https://glitch.com)", true);
    embed.addField("Created In", "[TypeScript](https://npmjs.com/package/typescript)", true)
    embed.addField("Library", "[discord.js](https://npmjs.com/package/discord.js)", true);
    embed.addField("Source Code", "[GitHub](https://github.com/subnauticamodding/camp)", true);
    message.channel.send(embed);
  }
}