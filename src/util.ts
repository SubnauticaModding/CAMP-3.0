import * as Discord from "discord.js";
import { bot } from "..";

export function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

export async function getMessage(id: string, channel?: string | Discord.TextChannel) {
  if (typeof channel === "string") channel = bot.channels.get(channel) as Discord.TextChannel;
  if (channel) {
    try {
      const message = await channel.fetchMessage(id);
      if (message) return message;
    } catch (e) {
      return false;
    }
  }
  return false;
}

declare module "discord.js" {
  // tslint:disable-next-line:interface-name
  interface RichEmbed {
    addFieldIf(name: any, value: any, condition: boolean, inline?: boolean): RichEmbed;
  }
}

Discord.RichEmbed.prototype.addFieldIf = function(name: any, value: any, condition: boolean, inline?: boolean) {
  if (!condition) return this;
  return this.addField(name, value, inline);
};
