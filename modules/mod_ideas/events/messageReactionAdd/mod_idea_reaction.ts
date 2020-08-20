import Discord from "discord.js";
import { bot, guild } from "../../../../src";
import config from "../../../../src/config";
import ModIdea from "../../src/mod_idea";
import ModIdeaStatus from "../../src/mod_idea_status";

bot.on("messageReactionAdd", async (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) => {
  if (reaction.partial) reaction = await reaction.fetch();
  if (user.partial) user = await user.fetch();

  if (reaction.message.guild?.id != guild.id) return;
  if (user.bot) return;

  var modidea = ModIdea.getFromMessage(reaction.message);
  if (!modidea) return;

  switch (reaction.emoji.id ?? reaction.emoji.toString()) {
    case config.emojis.abstain:
      if (user.id == modidea.author || modidea.status != ModIdeaStatus.None || modidea.rating.disabled) break;
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      if (modidea.rating.likes.length - modidea.rating.dislikes.length > -10) delete modidea.rating.pendingDeletionStart;
      modidea.update();
      modidea.edit(reaction.message);
      break;
    case config.emojis.downvote:
      if (user.id == modidea.author || modidea.status != ModIdeaStatus.None || modidea.rating.disabled) break;
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.rating.dislikes.push(user.id);
      if (modidea.rating.likes.length - modidea.rating.dislikes.length > -10) modidea.rating.pendingDeletionStart = Date.now();
      modidea.update();
      modidea.edit(reaction.message);
      break;
    case config.emojis.upvote:
      if (user.id == modidea.author || modidea.status != ModIdeaStatus.None || modidea.rating.disabled) break;
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.rating.likes.push(user.id);
      if (modidea.rating.likes.length - modidea.rating.dislikes.length > -10) delete modidea.rating.pendingDeletionStart;
      modidea.update();
      modidea.edit(reaction.message);
      break;
    case config.emojis.update:
      modidea.update();
      modidea.edit(reaction.message);
      await reaction.message.reactions.removeAll();
      ModIdea.addReactions(reaction.message);
      break;
  }

  reaction.users.remove(user);
});