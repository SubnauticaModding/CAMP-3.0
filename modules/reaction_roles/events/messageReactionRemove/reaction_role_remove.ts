import Discord from "discord.js";
import { bot, guild } from "../../../../src";
import config from "../../../../src/config";
import * as parser from "../../../../src/parser";

bot.on("messageReactionRemove", async (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  if (reaction.partial) reaction = await reaction.fetch();
  if (user.partial) user = await user.fetch();

  if (reaction.message.guild?.id != guild.id) return;
  if (user.bot) return;

  for (const reactionRole of config.modules.reaction_roles.ids) {
    if (reactionRole.message == reaction.message.id && reactionRole.emoji == (reaction.emoji.id ?? reaction.emoji.toString())) {
      const member = await parser.member(user.id);
      member?.roles.remove(reactionRole.role, `User removed reaction "${reactionRole.emoji}" on message "${reaction.message.content.substr(0, 50)}${reaction.message.content.length > 50 ? "..." : ""}"`);
    }
  }
});