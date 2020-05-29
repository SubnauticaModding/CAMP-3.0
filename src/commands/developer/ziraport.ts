import Discord from "discord.js";

import config from "../../config";
import * as data from "../../data";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import ModIdea from "../../data_types/mod_idea";
import * as embeds from "../../embeds";
import * as parser from "../../parser";
import * as util from "../../util";

export default class implements Command {
  name = "ziraport";
  aliases = ["zp"];
  description = "";
  usage = "<old list channel ID or #mention> <new list channel ID or #mention>";
  hidden = true;
  getPermission = (message: Discord.Message) => CommandPermission.Developer;

  public async execute(message: Discord.Message, args: string[]) {
    const oldList = parser.textChannel(args[0]);
    if (!oldList) return embeds.error(message, "Invalid arguments. Expected a text channel id as the first parameter.");

    const newList = parser.textChannel(args[1]);
    if (!newList) return embeds.error(message, "Invalid arguments. Expected a text channel id as the third parameter.");

    if (oldList.id == newList.id) return embeds.error(message, "Invalid arguments. Expected two different text channel ids as the first two parameters.");

    const loadingMsg = await message.channel.send(new Discord.MessageEmbed({
      title: `<a:a:${config.emojis.loading}> Porting in progress...`
    }));

    var oldListMessages = await util.getAllMessages(oldList);
    for (var msg of oldListMessages) {
      var idea = await this.createZiraIdea(msg);
      await idea.send(newList.id, true, true);
    }

    loadingMsg.delete({ reason: "Loading message deleted." });
    embeds.success(message, "");
  }

  private async createZiraIdea(message: Discord.Message) {
    var last = ModIdea.getLastFileId();
    var ideas = data.read("mod_ideas/" + last, []) as ModIdea[];

    if (ideas.length == 100) {
      ideas = [];
      last++;
    }

    const embed = message.embeds[0];
    const id = (embed.author?.name?.match(/\d{13,}/g) ?? [undefined])[0];
    const idea = new ModIdea(ModIdea.getNextID(), embed.description ?? embed.fields[0].value, id ?? message.author.id, undefined);
    idea.time = embed.timestamp ?? 0;
    idea.comment = (embed.title?.toLowerCase().includes("potential") || embed.title?.toLowerCase().includes("approved")) && embed.fields.length > 0 ? embed.fields[0].value : "";

    for (var reaction of message.reactions.cache.values()) {
      var users = [...(await reaction.users.fetch()).keys()].filter(u => u != "275813801792634880" && u != (id ?? message.author.id));
      switch (reaction.emoji.id ?? reaction.emoji.toString()) {
        case "653230762254008350":
        case "👍":
          idea.rating.likes = users;
          break;
        case "653231195051786260":
        case "👎":
          idea.rating.dislikes = users;
          break;
      }
    }

    const doubleVotes = idea.rating.likes.filter(x => idea.rating.dislikes.includes(x));
    idea.rating.likes = idea.rating.likes.filter(x => !doubleVotes.includes(x));
    idea.rating.dislikes = idea.rating.dislikes.filter(x => !doubleVotes.includes(x));

    ideas.push(idea);
    data.write("mod_ideas/" + last, ideas);

    return idea;
  }
}