import * as Discord from "discord.js";
import { bot } from "..";

export function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

export async function getMessage(id: string) {
  for (const ch of bot.channels.values()) {
    if (ch.type !== "text") continue;
    const channel = ch as Discord.TextChannel;
    try {
      const message = await channel.fetchMessage(id);
      if (message) return message;
    } catch (e) {
      continue;
    }
  }
  return false;
}
