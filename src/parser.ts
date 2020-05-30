import Discord from "discord.js";
import { bot, guild, nexus } from "..";
import ModIdea from "./data_types/mod_idea";

export function modIdea(id: string) {
  if (id.startsWith("#")) id = id.substr(1);
  if (parseInt(id).toString() != id) return;

  const modidea = ModIdea.get(parseInt(id));
  return modidea;
}

export function textChannel(id: string) {
  if (id.startsWith("<#") && id.endsWith(">")) id = id.substring(2, id.length - 1);
  const ch = bot.channels.cache.get(id);
  if (!ch) return;
  if (ch.type != "news" && ch.type != "text") return;
  return ch as Discord.TextChannel;
}

export async function message(channel: string, message: string) {
  const ch = textChannel(channel);
  if (!ch) return;
  const msg = await ch.messages.fetch(message);
  if (!msg) return;
  return msg;
}

export async function member(id: string) {
  if (id.startsWith("<@!") && id.endsWith(">")) id = id.substring(3, id.length - 1);
  if (id.startsWith("<@") && id.endsWith(">")) id = id.substring(2, id.length - 1);
  const mem = await guild.members.fetch({ user: id });
  if (!mem) return;
  if (mem.deleted) return;
  return mem;
}

export async function nexusLink(link: string) {
  const matches = [...link.matchAll(/https?:\/\/(?:www\.)?nexusmods\.com\/(subnautica(?:belowzero)?)\/mods\/(\d+)\/?/g)];

  if (matches.length != 1) return;

  const game = matches[0][1];
  const id = matches[0][2];

  if ((game != "subnautica" && game != "subnauticabelowzero") || parseInt(id).toString() != id) return;

  const modinfo = await nexus.getModInfo(parseInt(id), game);
  return modinfo;
}
