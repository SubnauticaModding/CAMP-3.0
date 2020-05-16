import Discord from "discord.js";
import dotenv from "dotenv";
import nexusmods from "@nexusmods/nexus-api";

import CommandPermission from "./src/data_types/command_permission";
import ModIdea from "./src/data_types/mod_idea";
import * as commands from "./src/commands";
import config from "./src/config";
import * as util from "./src/util";
import web_init from "./src/web_init";
import * as embeds from "./src/embeds";

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
  if (message.channel.id !== config.channels.ideas_submit) return;
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix)) return;

  const ideamsg = ModIdea.create(message).send(config.channels.ideas_list, true, true);
  message.react(config.emojis.success);
  embeds.success(message, `Your mod idea has been submitted.\nClick [here](${(await ideamsg).url}) to view it.`, 5);
});

bot.on("message", async (message) => {
  if (message.partial) message = await message.fetch();

  if (message.guild?.id !== guild.id) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.split(/ +/g);
  const cmd = args.shift()?.substr(config.prefix.length);

  for (var i = 0; i < 10; i++) {
    args[i] = args[i] ?? "";
  }

  if (!cmd) return;

  for (const commandType of Object.values(commands)) {
    const command = new commandType();
    // @ts-ignore 2345 - Argument of type 'string' is not assignable to parameter of type 'never'.
    if (command.name == cmd || command.aliases?.includes(cmd)) {
      if (getPermission(message.member) >= command.permission) {
        command.execute(message, args);
      } else if (command.permission == CommandPermission.Developer) {
        embeds.error(message, "You don't have permission to execute this command.\nThis command may only be used by <@183249892712513536>.");
      } else {
        var toSay = "You don't have permission to execute this command.";
        const roles: string[] = [];
        for (var permission in config.permissions) {
          // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '{ 1: string, 2:string, ... }'
          if (parseInt(permission) >= command.permission) roles.push(`<@&${config.permissions[permission]}>`);
        }

        if (roles.length == 1) {
          toSay += `\nIn order to execute this command, you need the following role: ${roles[0]}.`;
        } else if (roles.length > 1) {
          toSay += "\nIn order to execute this command, you need one of the following roles: ";
          const lastRole = roles.pop();
          toSay += roles.join(", ");
          toSay += `or ${lastRole}.`;
        }

        embeds.error(message, toSay);
      }
    }
  }
});

bot.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) reaction = await reaction.fetch();
  if (user.partial) user = await user.fetch();

  if (reaction.message.guild?.id !== guild.id) return;
  if (user.bot) return;

  var modidea = ModIdea.getFromMessage(reaction.message);
  if (!modidea) return;

  switch (reaction.emoji.id ?? reaction.emoji.toString()) {
    case config.emojis.abstain:
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.update();
      modidea.edit(reaction.message);
      break;
    case config.emojis.downvote:
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.rating.dislikes.push(user.id);
      modidea.update();
      modidea.edit(reaction.message);
      break;
    case config.emojis.upvote:
      modidea.rating.likes = modidea.rating.likes.filter(v => v != user.id);
      modidea.rating.dislikes = modidea.rating.dislikes.filter(v => v != user.id);
      modidea.rating.likes.push(user.id);
      modidea.update();
      modidea.edit(reaction.message);
      break;
    case config.emojis.update:
      modidea.update();
      modidea.edit(reaction.message);
      break;
  }

  reaction.users.remove(user);
});

function getPermission(member: Discord.GuildMember | null): CommandPermission {
  if (!member) return CommandPermission.None;
  if (member.id == "183249892712513536") return CommandPermission.Developer;
  if (member.hasPermission("ADMINISTRATOR")) return CommandPermission.ServerAdministrator;

  var maxPermission = 0;
  const roles = [...member.roles.cache.values()].map(r => r.id);
  for (var permission in config.permissions) {
    // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '{ 1: string, 2:string, ... }'
    if (roles.includes(config.permissions[permission])) {
      maxPermission = Math.max(maxPermission, parseInt(permission));
    }
  }

  return maxPermission;
}