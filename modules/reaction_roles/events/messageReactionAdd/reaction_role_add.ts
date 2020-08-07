import Discord from "discord.js";
import * as parser from "../../../../../CAMP-3.0-Test/src/parser";
import { bot, guild } from "../../../../src";
import config from "../../../../src/config";

bot.on("messageReactionAdd", async (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  if (reaction.partial) reaction = await reaction.fetch();
  if (user.partial) user = await user.fetch();

  if (reaction.message.guild?.id != guild.id) return;
  if (user.bot) return;

  for (const reactionRole of config.modules.reaction_roles.ids) {
    if (reactionRole.message == reaction.message.id && reactionRole.emoji == (reaction.emoji.id ?? reaction.emoji.toString())) {
      const member = await parser.member(user.id);
      member?.roles.add(reactionRole.role, `User reacted to reaction "${reactionRole.emoji}" on message "${reaction.message.content.substr(0, 50)}${reaction.message.content.length > 50 ? "..." : ""}"`);
    }
  }
});