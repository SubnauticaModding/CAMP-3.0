import Discord from "discord.js";
import { commands } from "../../src/";
import Command from "../../src/command";
import config from "../../src/config";
import * as util from "../../src/util";

commands.push(new Command({
  name: "about",
  aliases: ["info"],
  description: "Shows information about the bot.",
  execute: async (message: Discord.Message, args: string[]) => {
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
  },
}));
