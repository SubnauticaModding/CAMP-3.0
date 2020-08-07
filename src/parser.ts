import Discord from "discord.js";
import { bot, guild } from ".";

/**
 * Returns a `Discord.TextChannel` from its ID.
 */
export function textChannel(id: string) {
  if (id.startsWith("<#") && id.endsWith(">")) id = id.substring(2, id.length - 1);
  const ch = bot.channels.cache.get(id);
  if (!ch) return;
  if (ch.type != "news" && ch.type != "text") return;
  return ch as Discord.TextChannel;
}

/**
 * Returns a `Discord.Message` from its ID.
 */
export async function message(channel: string, message: string) {
  const ch = textChannel(channel);
  if (!ch) return;
  const msg = await ch.messages.fetch(message);
  if (!msg) return;
  return msg;
}

/**
 * Returns a `Discord.GuildMember` from its ID.
 */
export async function member(id: string) {
  if (id.startsWith("<@!") && id.endsWith(">")) id = id.substring(3, id.length - 1);
  if (id.startsWith("<@") && id.endsWith(">")) id = id.substring(2, id.length - 1);
  const mem = await guild.members.fetch({ user: id });
  if (!mem) return;
  if (mem.deleted) return;
  return mem;
}