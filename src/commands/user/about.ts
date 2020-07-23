import Discord from "discord.js";
import Command from "../../command";
import CommandPermission from "../../command_permission";
import config from "../../config";
import * as util from "../../util";

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
    embed.addField("Hosted On", "[DigitalOcean](https://digitalocean.com)", true);
    embed.addField("Created In", "[TypeScript](https://npmjs.com/package/typescript)", true)
    embed.addField("Library", "[discord.js](https://npmjs.com/package/discord.js)", true);
    embed.addField("Source Code", "[GitHub](https://github.com/subnauticamodding/camp)", true);

    const aboutMessage = await message.channel.send(embed);

    await util.wait(120);

    message.delete({ reason: "Command invocation message deleted." });
    aboutMessage.delete({ reason: "Command reply message deleted." });
  }
}