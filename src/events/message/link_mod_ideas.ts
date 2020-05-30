import Discord from "discord.js";
import { guild } from "../../..";
import config from "../../config";
import ModIdea from "../../data_types/mod_idea";

export default async function (message: Discord.Message) {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.channels.modideas.discussion) return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith("c/") || message.content.toLowerCase().startsWith("z/")) return;

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
}
