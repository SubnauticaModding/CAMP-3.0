import Discord from "discord.js";
import { bot, guild } from "../../..";
import config from "../../config";

export default async function (message: Discord.Message | Discord.PartialMessage) {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id != guild.id) return;
  if (message.channel.id != config.channels.modideas.discussion) return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith("c/")) return;

  const nextMessages = (await message.channel.messages.fetch({ after: message.id, limit: 5 })).array();
  for (const msg of nextMessages) {
    if (msg.author.id != bot.user?.id) continue;
    if (!msg.embeds || msg.embeds.length != 1) continue;

    const embed = msg.embeds[0];
    if (embed.footer?.text == message.id) msg.delete({ reason: "Deleted mod ideas link message because original message was deleted." });
  }
}
