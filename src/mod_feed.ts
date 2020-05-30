import Discord from "discord.js";

import { nexus } from "..";
import config from "./config";
import * as data from "./data";
import * as parser from "./parser";

export function updateModFeeds() {
  updateModFeed("subnautica", "RELEASES", config.channels.modfeed.subnautica.releases);
  updateModFeed("subnauticabelowzero", "RELEASES", config.channels.modfeed.belowzero.releases);
  updateModFeed("subnautica", "UPDATES", config.channels.modfeed.subnautica.updates);
  updateModFeed("subnauticabelowzero", "UPDATES", config.channels.modfeed.belowzero.updates);
}

async function updateModFeed(game: "subnautica" | "subnauticabelowzero", type: "RELEASES" | "UPDATES", channel: string, id?: string) {
  switch (type) {
    case "RELEASES":
      await updateReleasesFeed(game, channel, id);
      break;
    case "UPDATES":
      await updateUpdatesFeed(game, channel, id);
      break;
  }
}

async function updateReleasesFeed(game: "subnautica" | "subnauticabelowzero", channel: string, id?: string) {
  const textChannel = parser.textChannel(channel);
  if (!textChannel) return;

  const mods = await nexus.getLatestAdded(game);
  const knownReleases = data.read(`mod_feeds/${game}_releases${id ? "_" + id : ""}`, []) as number[];

  for (const mod of mods) {
    if (!mod.available || mod.status != "published") continue;
    if (knownReleases.includes(mod.mod_id)) continue;

    const embed = new Discord.MessageEmbed();
    embed.setAuthor(`Mod Release (${gameTitle(game)})`, "https://cdn.discordapp.com/avatars/458591118209187851/686314fcfa96fea3b0bd34b26182b05a.png?size=1024");
    embed.setColor("faa741");
    embed.setTitle(mod.name);
    embed.setURL(`https://nexusmods.com/${game}/mods/${mod.mod_id}`);
    embed.setDescription(mod.summary?.replace(/<br \/>/g, "\n").replace(/\n+/g, "\n"));
    embed.addField("Mod ID", mod.mod_id, true);
    embed.addField("Author", `[${mod.user.name}](https://nexusmods.com/${game}/users/${mod.user.member_id})`, true);
    embed.addField("Category", await getCategory(game, mod.category_id), true);
    embed.setImage(mod.picture_url ?? "");
    embed.setFooter(`v${mod.version}`);
    embed.setTimestamp(mod.created_timestamp * 1000);

    const message = await textChannel.send(embed);
    message.crosspost();

    knownReleases.push(mod.mod_id);
    data.write(`mod_feeds/${game}_releases${id ? "_" + id : ""}`, knownReleases);
  }
}

async function updateUpdatesFeed(game: "subnautica" | "subnauticabelowzero", channel: string, id?: string) {
  const textChannel = parser.textChannel(channel);
  if (!textChannel) return;

  const mods = await nexus.getLatestUpdated(game);
  const knownUpdates = data.read(`mod_feeds/${game}_updates${id ? "_" + id : ""}`, []) as { id: number, version: string }[];

  for (const mod of mods) {
    if (!mod.available || mod.status != "published") continue;
    if (knownUpdates.filter(x => x.id == mod.mod_id && x.version == mod.version).length > 0) continue;
    if (mod.created_timestamp == mod.updated_timestamp) continue;

    const embed = new Discord.MessageEmbed();
    embed.setAuthor(`Mod Update (${gameTitle(game)})`, "https://cdn.discordapp.com/avatars/458591118209187851/686314fcfa96fea3b0bd34b26182b05a.png?size=1024");
    embed.setColor("57a5cc");
    embed.setTitle(mod.name);
    embed.setURL(`https://nexusmods.com/${game}/mods/${mod.mod_id}`);
    embed.setDescription(mod.summary?.replace(/<br \/>/g, "\n").replace(/\n+/g, "\n"));
    embed.addField("Mod ID", mod.mod_id, true);
    embed.addField("Author", `[${mod.user.name}](https://nexusmods.com/${game}/users/${mod.user.member_id})`, true);
    embed.addField("Category", await getCategory(game, mod.category_id), true);
    embed.setImage(mod.picture_url ?? "");
    embed.setFooter(`v${mod.version}`);
    embed.setTimestamp(mod.created_timestamp * 1000);

    const changelogs = await nexus.getChangelogs(mod.mod_id, game);
    if (changelogs[mod.version] && changelogs[mod.version].length > 0) {
      embed.addField("Changelogs", `• ${changelogs[mod.version].join("\n• ")}`);
    }

    const message = await textChannel.send(embed);
    message.crosspost();

    knownUpdates.push({ id: mod.mod_id, version: mod.version });
    data.write(`mod_feeds/${game}_updates${id ? "_" + id : ""}`, knownUpdates);
  }
}

async function getCategory(game: "subnautica" | "subnauticabelowzero", category: number) {
  const Game = await nexus.getGameInfo(game);
  const validCategories = Game.categories.filter(c => c.category_id == category);

  if (validCategories.length < 1) return "_none_";
  return validCategories.map(c => c.name).join(", ");
}

function gameTitle(game: "subnautica" | "subnauticabelowzero") {
  if (game == "subnautica") return "Subnautica";
  return "Below Zero";
}