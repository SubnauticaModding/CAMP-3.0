import Discord from "discord.js";
import { commands } from "../../../../src/";
import Command from "../../../../src/command";
import * as data from "../../../../src/data";
import * as util from "../../../../src/util";

commands.push(new Command({
  name: "tag",
  aliases: ["tags", "qr", "quickreply", "reply", "macro"],
  description: "Sends a tag to the chat. To view all available tags, run this command with no parameters.",
  usage: "[tag name]",
  execute: async (message: Discord.Message, args: string[]) => {
    const tags = data.read("tags/tags", [] as Tag[], true);

    const tagName = args.join(" ");
    if (!tagName) {
      const embed = new Discord.MessageEmbed();

      if (tags.length == 0) {
        embed.setTitle("Error");
        embed.setDescription("There are no tags available.");
        embed.setColor("RED");
      } else {
        embed.setTitle("Available Tags");
        embed.setDescription(`• ${tags.filter(t => !t.hidden).map(t => `\`${t.name}\``).sort().join("\n• ")}`);
        embed.setColor("BLUE");
      }

      const replyMessage = await message.channel.send(embed);
      await util.wait(tags.length == 0 ? 10 : 30);

      message.delete({ reason: "Command invocation message deleted." });
      replyMessage.delete({ reason: "Command reply message deleted." });
      return;
    }

    const tagObjs = tags.filter(t => t.name == tagName);
    if (tagObjs.length == 0) {
      const embed = new Discord.MessageEmbed();
      embed.setTitle("Error");
      embed.setColor("RED");

      if (tags.length == 0) {
        embed.setDescription("There are no tags available.");
      } else {
        embed.setDescription(`That tag does not exist.`);
        embed.addField("Available Tags", `• ${tags.filter(t => !t.hidden).map(t => `\`${t.name}\``).sort().join("\n• ")}`);
      }

      const replyMessage = await message.channel.send(embed);
      await util.wait(tags.length == 0 ? 10 : 30);

      message.delete({ reason: "Command invocation message deleted." });
      replyMessage.delete({ reason: "Command reply message deleted." });
      return;
    }

    const tagObj = tagObjs[0];
    const embed = new Discord.MessageEmbed();
    if (tagObj.title) embed.setTitle(tagObj.title);
    if (tagObj.description) embed.setDescription(tagObj.description);
    if (tagObj.url) embed.setURL(tagObj.url);
    if (tagObj.color) embed.setColor(tagObj.color);
    if (tagObj.thumbnail) embed.setThumbnail(tagObj.thumbnail);
    if (tagObj.image) embed.setImage(tagObj.image);
    if (tagObj.fields) embed.addFields(tagObj.fields);

    if (tagObj.content) message.channel.send(tagObj.content, embed);
    else message.channel.send(embed);
  },
}));

type Tag = {
  name: string;
  hidden?: boolean;
  content?: string;
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  fields?: Discord.EmbedFieldData[];
  thumbnail?: string;
  image?: string;
}