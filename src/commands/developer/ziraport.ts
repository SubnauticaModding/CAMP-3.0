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
  usage = "<old ideas list channel> <new ideas list channel>";
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
      idea.send(newList.id, true, true);
    }

    loadingMsg.delete();
    embeds.success(message, "");
  }

  private async createZiraIdea(message: Discord.Message) {
    var last = ModIdea.getLastFileId();
    var ideas = data.read("mod_ideas/" + last, []) as ModIdea[];

    if (ideas.length === 100) {
      ideas = [];
      last++;
    }

    const embed = message.embeds[0];
    const id = (embed.author?.name?.match(/\d{13,}/g) ?? [undefined])[0];
    const idea = new ModIdea(ModIdea.getNextID(), embed.description ?? embed.fields[0].value, id ?? message.author.id, undefined);
    idea.time = embed.timestamp ?? 0;
    idea.comment = (embed.title?.toLowerCase().includes("potential") || embed.title?.toLowerCase().includes("approved")) && embed.fields.length > 0 ? embed.fields[0].value : "";

    ideas.push(idea);
    data.write("mod_ideas/" + last, ideas);

    return idea;
  }
}