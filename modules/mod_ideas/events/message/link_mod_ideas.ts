import Discord from "discord.js";
import { bot, guild } from "../../../../src";
import config from "../../../../src/config";
import ModIdea from "../../src/mod_idea";

bot.on("message", async (message: Discord.Message) => {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.modules.mod_ideas.channels.discussion) return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(config.prefix)) return;

  const references = await ModIdea.getReferences(message.content);
  if (Object.values(references).length == 0) return;

  const embed = new Discord.MessageEmbed();
  embed.setColor("BLUE");
  embed.setDescription("");
  embed.setFooter(message.id);

  for (var key in references) {
    const modidea = references[key];
    var msg = await modidea.getMessage();
    if (!msg) continue;
    if (msg.partial) msg = await msg.fetch();

    embed.description += `[#${key}](${msg.url}) by <@${modidea.author}> - ${modidea.text.substr(0, 100).replace(/[\n\r]+/g, " ").replace(/:\/\//g, ":/​/​")}${modidea.text.substr(0, 100) == modidea.text ? "" : "..."}\n\n`;
  }

  message.channel.send(embed);
});