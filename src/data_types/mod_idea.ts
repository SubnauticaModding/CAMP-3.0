import Discord from "discord.js";
import readdir from "fs-readdir-recursive";
import path from "path";

import { bot } from "../..";
import config from "../config";
import * as data from "../data";
import ModIdeaStatus from "./mod_idea_status";
import ModIdeaRating from "./mod_idea_rating";

export default class ModIdea {
  id: number;
  text: string;
  author: string;
  time: number;
  image?: string;

  channel: string = "";
  message: string = "";

  status: ModIdeaStatus = ModIdeaStatus.None;
  edited: boolean = false;
  specialComment: string = "";
  comment: string = "";
  lastActor: string = "";
  rating: ModIdeaRating = new ModIdeaRating();

  linkedBy: number[] = [];

  public constructor(id: number, text: string, author: string, image?: string) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.image = image;

    this.time = Date.now();
  }

  public async send(channel: string | Discord.TextChannel, main: boolean, react: boolean) {
    if (typeof channel === "string") channel = bot.channels.cache.get(channel) as Discord.TextChannel;
    const message = await channel.send(await this.generateEmbed()) as Discord.Message;
    if (main) {
      this.updateMessage(message);
      this.update();
    }
    if (react) {
      ModIdea.addReactions(message);
    }
    return message;
  }

  public async edit(message: Discord.Message) {
    message.edit(await this.generateEmbed());
  }

  public async sendOrEdit(channel: string) {
    var newIdeaMsg;
    const oldMessage = await this.getMessage();
    if (oldMessage?.channel.id == channel) {
      newIdeaMsg = oldMessage;
      this.edit(oldMessage);
    } else {
      oldMessage?.delete();
      newIdeaMsg = await this.send(channel, true, false);
    }
    return newIdeaMsg;
  }

  public update() {
    const file = Math.floor((this.id - 1) / 100);
    const index = (this.id - 1) % 100;

    const ideas = data.read("mod_ideas/" + file, []) as ModIdea[];
    if (!ideas) return this;
    ideas[index] = this;

    data.write("mod_ideas/" + file, ideas);

    return this;
  }

  public async generateEmbed() {
    const user = await bot.users.fetch(this.author);
    const rating = this.rating.likes.length - this.rating.dislikes.length;

    const embed = new Discord.MessageEmbed();
    embed.setAuthor(user.tag, user.displayAvatarURL());
    embed.setColor(ModIdea.getColorFromStatus(this.status));
    embed.setDescription(await this.parseReferences(this.text, true));

    switch (this.status) {
      case ModIdeaStatus.Duplicate:
        embed.addField("Status", await this.parseReferences(`Duplicate of #${this.specialComment}`, true));
        embed.addField("Marked as duplicate by", `<@${this.lastActor}>`);
        break;
      case ModIdeaStatus.Removed:
        embed.addField("Status", `Removed`);
        embed.addField("Removed by", `<@${this.lastActor}>`);
        break;
      case ModIdeaStatus.None:
        embed.addField("Rating", `<:a:${ModIdea.getEmojiForRating(rating)}> \`${rating}\``, true);
        embed.addField("Votes", this.rating.likes.length + this.rating.dislikes.length, true);
        break;
      case ModIdeaStatus.Released:
        embed.addField("Status", `Released at ${this.specialComment}`);
        embed.addField("Marked as released by", `<@${this.lastActor}>`);
        break;
    }

    if (this.comment && this.comment.trim().length > 0) embed.addField("Comment", await this.parseReferences(this.comment, true));

    embed.setFooter(`ID: #${this.id}${this.edited ? " (edited)" : ""}`);
    embed.setImage(this.image ?? "");
    embed.setTimestamp(this.time);
    embed.setTitle(ModIdea.getTitleFromStatus(this.status));

    return embed;
  }

  public async parseReferences(text: string, save: boolean) {
    return await text.replaceAsync(/#(\d+)/g, async (substring: string, ...args: any[]) => {
      if (parseInt(args[0]) == this.id) return substring;

      const modidea = ModIdea.get(parseInt(args[0]));
      if (!modidea) return substring;

      var message = await modidea.getMessage();
      if (!message) return substring;
      if (message.partial) message = await message.fetch();

      if (save && !modidea.linkedBy.includes(this.id)) {
        modidea.linkedBy.push(this.id);
        modidea.update();
      }

      return `[${substring}](${message.url})`;
    });
  }

  public async getMessage() {
    try {
      if (!this.channel || !this.message) return;
      const ideaChannel = await bot.channels.fetch(this.channel) as Discord.TextChannel;
      const ideaMsg = await ideaChannel.messages.fetch(this.message);
      return ideaMsg;
    } catch {
      return;
    }
  }

  public async updateMessage(message: Discord.Message) {
    this.channel = message.channel.id;
    this.message = message.id;

    var toRemove: number[] = [];
    for (var link of this.linkedBy) {
      const modidea = ModIdea.get(link);
      if (!modidea) {
        toRemove.push(link);
        continue;
      }

      var ideamsg = await modidea.getMessage();
      if (!ideamsg) {
        toRemove.push(link);
        continue;
      }
      if (ideamsg.partial) ideamsg = await ideamsg.fetch();

      modidea.edit(ideamsg);
    }
    this.linkedBy = this.linkedBy.filter(x => !toRemove.includes(x));
    this.update();
  }

  public static create(message: Discord.Message) {
    var last = ModIdea.getLastFileId();
    var ideas = data.read("mod_ideas/" + last, []) as ModIdea[];

    if (ideas.length === 100) {
      ideas = [];
      last++;
    }

    const idea = new ModIdea(ModIdea.getNextID(), message.content, message.author.id, message.attachments.size > 0 ? message.attachments.first()?.url : undefined);

    ideas.push(idea);
    data.write("mod_ideas/" + last, ideas);

    return idea;
  }

  public static get(id: number): ModIdea | undefined {
    const file = Math.floor((id - 1) / 100);
    const index = (id - 1) % 100;

    const ideas = data.read("mod_ideas/" + file, []) as any[];
    if (!ideas) return;

    return Object.assign(new ModIdea(0, "", ""), ideas[index]) as ModIdea;
  }

  public static getFromMessage(message: Discord.Message): ModIdea | undefined {
    if (message.author.id !== bot.user?.id) return;
    if (!message.embeds || message.embeds.length < 1) return;

    const embed = message.embeds[0];
    if (!embed || !embed.footer?.text) return;

    var footer = embed.footer.text;
    if (!footer.startsWith("ID: #")) return;

    footer = footer.substring("ID: #".length);
    if (footer.toLowerCase().endsWith(" (edited)")) footer = footer.substr(0, footer.length - 9);

    if (parseInt(footer).toString() !== footer) return;

    return ModIdea.get(parseInt(footer));
  }

  public static getColorFromStatus(status: ModIdeaStatus): string {
    switch (status) {
      case ModIdeaStatus.Deleted:
        return "DEFAULT";
      case ModIdeaStatus.Duplicate:
        return "DARK_GREY";
      case ModIdeaStatus.Removed:
        return "RED";
      case ModIdeaStatus.None:
        return "BLUE";
      case ModIdeaStatus.Released:
        return "GREEN";
    }
  }

  public static getTitleFromStatus(status: ModIdeaStatus): string {
    switch (status) {
      case ModIdeaStatus.Deleted:
        return "Deleted Mod Idea";
      case ModIdeaStatus.Duplicate:
        return "Duplicate Mod Idea";
      case ModIdeaStatus.Removed:
        return "Removed Mod Idea";
      case ModIdeaStatus.None:
        return "Mod Idea";
      case ModIdeaStatus.Released:
        return "Released Mod Idea";
    }
  }

  public static getEmojiForRating(rating: number): string {
    if (rating < 0) return config.emojis.downvote;
    if (rating > 0) return config.emojis.upvote;
    return config.emojis.abstain;
  }

  public static async addReactions(message: Discord.Message) {
    await message.react(config.emojis.upvote);
    await message.react(config.emojis.abstain);
    await message.react(config.emojis.downvote);
  }

  private static getNextID(): number {
    var last = ModIdea.getLastFileId();
    var ideas = data.read("mod_ideas/" + last, []);

    if (ideas.length === 100) {
      ideas = [];
      last++;
    }

    return last * 100 + ideas.length + 1;
  }

  private static getLastFileId(): number {
    return Math.max(0, ...readdir(path.join(__dirname, "../data/mod_ideas"))
      .filter((p) => p.endsWith(".json"))
      .map((p) => parseInt(p.substring(0, p.length - 5))),
    );
  }
}