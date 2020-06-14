import Discord from "discord.js";
import { guild } from "../../..";
import config from "../../config";
import * as parser from "../../parser";

export default async function (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) {
  if (reaction.partial) reaction = await reaction.fetch();
  if (user.partial) user = await user.fetch();

  if (reaction.message.guild?.id != guild.id) return;
  if (user.bot) return;

  for (const reactionRole of config.reactionroles) {
    if (reactionRole.message == reaction.message.id && reactionRole.emoji == (reaction.emoji.id ?? reaction.emoji.toString())) {
      const member = await parser.member(user.id);
      member?.roles.remove(reactionRole.role);
    }
  }
}
