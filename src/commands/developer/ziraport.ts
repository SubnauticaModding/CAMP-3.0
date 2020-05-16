import Discord from "discord.js";

import * as data from "../../data";
import Command from "../../data_types/command";
import CommandPermission from "../../data_types/command_permission";
import ModIdea from "../../data_types/mod_idea";
import ModIdeaStatus from "../../data_types/mod_idea_status";
import * as embeds from "../../embeds";
import * as parser from "../../parser";
import * as util from "../../util";

export default class implements Command {
  name = "ziraport";
  aliases = ["zp"];
  description = "";
  usage = "<old ideas list> <old ideas released> <new ideas list> <new ideas released>";
  permission = CommandPermission.Developer;

  public async execute(message: Discord.Message, args: string[]) {
    const oldList = parser.textChannel(args[0]);
    if (!oldList) return embeds.error(message, "Invalid arguments. Expected a text channel id as the first parameter");

    const oldReleased = parser.textChannel(args[1]);
    if (!oldReleased) return embeds.error(message, "Invalid arguments. Expected a text channel id as the second parameter");

    const newList = parser.textChannel(args[2]);
    if (!newList) return embeds.error(message, "Invalid arguments. Expected a text channel id as the fourth parameter");

    const newReleased = parser.textChannel(args[3]);
    if (!newReleased) return embeds.error(message, "Invalid arguments. Expected a text channel id as the fifth parameter");

    var oldListMessages = await util.getAllMessages(oldList);
    for (var msg of oldListMessages) {
      var idea = await this.createNormalZiraIdea(msg);
      idea.send(newList.id, true, true);
    }

    var oldReleasedMessages = await util.getAllMessages(oldReleased);
    for (var msg of oldReleasedMessages) {
      var idea = await this.createNormalZiraIdea(msg);
      idea.send(newReleased.id, true, false);
    }

    // var oldRemovedMessages = await util.getAllMessages(oldRemoved);
    // for (var msg of oldRemovedMessages) {
    //   var idea = await this.createRemovedZiraIdea(msg);
    //   idea.send(newRemoved.id, true, false);
    // }
  }

  private async createNormalZiraIdea(message: Discord.Message) {
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
    idea.comment = embed.title?.toLowerCase().includes("potential") && embed.fields.length > 0 ? embed.fields[0].value : "";

    ideas.push(idea);
    data.write("mod_ideas/" + last, ideas);

    return idea;
  }

  // private async createRemovedZiraIdea(message: Discord.Message) {
  //   var last = ModIdea.getLastFileId();
  //   var ideas = data.read("mod_ideas/" + last, []) as ModIdea[];

  //   if (ideas.length === 100) {
  //     ideas = [];
  //     last++;
  //   }

  //   const embed = message.embeds[0];
  //   const id = (embed.author?.name?.match(/\d{13,}/g) ?? [undefined])[0];
  //   const idea = new ModIdea(ModIdea.getNextID(), embed.description ?? embed.fields[0].value, id ?? message.author.id, undefined);
  //   idea.status = ModIdeaStatus.Removed;
  //   idea.lastActor = "493359366381240341";
  //   idea.time = embed.timestamp ?? 0;
  //   idea.comment = embed.description ? (embed.fields.length > 0 ? embed.fields[0].value : "") : (embed.fields.length > 1 ? embed.fields[1].value : "");

  //   ideas.push(idea);
  //   data.write("mod_ideas/" + last, ideas);

  //   return idea;
  // }
}