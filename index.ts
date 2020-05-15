import Discord from "discord.js";
import dotenv from "dotenv";
import nexusmods from "@nexusmods/nexus-api";

import * as commands from "./src/commands";
import config from "./src/config";
import * as mod_ideas from "./src/mod_ideas";
import * as util from "./src/util";
import web_init from "./src/web_init";

dotenv.config();
web_init();
console.log("Environment: " + config.environment);
console.log("Launching bot...");
util.ensureFolders(__dirname, "data", "mod_ideas");

export const bot = new Discord.Client({
  disableMentions: "everyone",
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
});
export var guild: Discord.Guild;
export var nexus: nexusmods;

(async () => {
  console.log("Creating nexusmods object...")
  nexus = await nexusmods.create(process.env.NEXUS_API_KEY ?? "", "SNModding-CAMP-Bot", "3.0.0", "Subnautica");
  console.log("Nexusmods object created");
})();

bot.login(process.env.DISCORD_TOKEN);

bot.on("ready", () => {
  console.log("Bot is ready.");
  var mainGuild = bot.guilds.cache.get(config.guild);
  if (!mainGuild) console.error("Main guild missing!");
  else guild = mainGuild;
});

bot.on("message", async (message) => {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id !== guild.id) return;
  if (message.channel.id !== config.mod_ideas.submit_channel) return;
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix)) return;

  const ideamsg = mod_ideas.sendModIdea(mod_ideas.createModIdea(message), config.mod_ideas.list_channel, true, true);
  message.react(config.emojis.success);
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    description: `Your mod idea has been submitted.\nClick [here](${(await ideamsg).url}) to view it.`,
    color: "GREEN"
  }));

  await util.wait(10);

  message.delete();
  replymsg.delete();
});

bot.on("message", async (message) => {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id !== guild.id) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.split(/ +/g);
  const cmd = args.shift()?.substr(config.prefix.length);

  if (!cmd) return;

  for (const commandType of Object.values(commands)) {
    const command = new commandType();
    if (command.name == cmd || command.aliases?.includes(cmd)) {
      command.execute(message, args);
    }
  }
});

bot.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) reaction = await reaction.fetch();
  if (user.partial) user = await user.fetch();

  if (reaction.message.guild?.id !== guild.id) return;
  if (user.bot) return;

  var modidea = mod_ideas.getModIdeaFromMessage(reaction.message);
  if (!modidea) return;

  switch (reaction.emoji.id ?? reaction.emoji.toString()) {
    case config.emojis.abstain:
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      mod_ideas.updateModIdea(modidea);
      mod_ideas.editModIdea(modidea, reaction.message);
      break;
    case config.emojis.downvote:
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.rating.dislikes.push(user.id);
      mod_ideas.updateModIdea(modidea);
      mod_ideas.editModIdea(modidea, reaction.message);
      break;
    case config.emojis.upvote:
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.rating.likes.push(user.id);
      mod_ideas.updateModIdea(modidea);
      mod_ideas.editModIdea(modidea, reaction.message);
      break;
    case config.emojis.update:
      mod_ideas.updateModIdea(modidea);
      mod_ideas.editModIdea(modidea, reaction.message);
      break;
  }

  reaction.users.remove(user);
});
