import * as nexusapi from "@nexusmods/nexus-api";
import Discord from "discord.js";
import { nexus } from "..";
import config from "./config";
import * as data from "./data";
import * as parser from "./parser";

class ModFeedEntry {
  id: number;
  version?: string;
  message?: string;
  channel?: string;
  changelogExpire?: number;

  constructor(id: number) {
    this.id = id;
  }
}

export function updateModFeeds() {
  updateReleasesFeed("subnautica", config.channels.modfeed.subnautica.releases);
  updateReleasesFeed("subnauticabelowzero", config.channels.modfeed.belowzero.releases);

  updateUpdatesFeed("subnautica", config.channels.modfeed.subnautica.updates);
  updateUpdatesFeed("subnauticabelowzero", config.channels.modfeed.belowzero.updates);

  updateChangelogs("subnautica");
  updateChangelogs("subnauticabelowzero");
}

async function updateReleasesFeed(game: "subnautica" | "subnauticabelowzero", channel: string, id?: string) {
  const textChannel = parser.textChannel(channel);
  if (!textChannel) return;

  const mods = await nexus.getLatestAdded(game);
  const knownReleases = data.read(`mod_feeds/${game}_releases${id ? "_" + id : ""}`, []) as ModFeedEntry[];

  for (const mod of mods) {
    if (!mod.available || mod.status != "published") continue;
    if (knownReleases.map(x => x.id).includes(mod.mod_id)) continue;

    const message = await textChannel.send(await generateEmbed(game, mod, "RELEASE"));
    message.crosspost();

    knownReleases.push({ id: mod.mod_id });
    data.write(`mod_feeds/${game}_releases${id ? "_" + id : ""}`, knownReleases);
  }
}

async function updateUpdatesFeed(game: "subnautica" | "subnauticabelowzero", channel: string, id?: string) {
  const textChannel = parser.textChannel(channel);
  if (!textChannel) return;

  const mods = await nexus.getLatestUpdated(game);
  const knownUpdates = data.read(`mod_feeds/${game}_updates${id ? "_" + id : ""}`, []) as ModFeedEntry[];

  for (const mod of mods) {
    if (!mod.available || mod.status != "published") continue;
    if (knownUpdates.filter(x => x.id == mod.mod_id && x.version == mod.version).length > 0) continue;
    if (mod.created_timestamp == mod.updated_timestamp) continue;

    const message = await textChannel.send(await generateEmbed(game, mod, "UPDATE"));
    message.crosspost();

    knownUpdates.push({
      id: mod.mod_id,
      version: mod.version,
      channel: message.channel.id,
      message: message.id,
      changelogExpire: Date.now() + 3600000, // 1 hour
    });
    data.write(`mod_feeds/${game}_updates${id ? "_" + id : ""}`, knownUpdates);
  }
}

async function updateChangelogs(game: "subnautica" | "subnauticabelowzero", id?: string) {
  const updates = data.read(`mod_feeds/${game}_updates${id ? "_" + id : ""}`, []) as ModFeedEntry[];
  for (const update of updates) {
    if (!update.channel || !update.message || !update.changelogExpire) continue;

    const msg = await parser.message(update.channel, update.message);
    if (!msg) {
      update.channel = update.message = update.changelogExpire = undefined;
      continue;
    }

    msg.edit(await generateEmbed(game, await nexus.getModInfo(update.id, game), "UPDATE"));

    if (update.changelogExpire <= Date.now()) {
      update.channel = update.message = update.changelogExpire = undefined;
    }
  }
}

async function generateEmbed(game: "subnautica" | "subnauticabelowzero", mod: nexusapi.IModInfo, type: "RELEASE" | "UPDATE") {
  const embed = new Discord.MessageEmbed();
  embed.setAuthor(`Mod ${type == "RELEASE" ? "Release" : "Update"} (${gameTitle(game)})`, "https://cdn.discordapp.com/avatars/458591118209187851/686314fcfa96fea3b0bd34b26182b05a.png?size=1024");
  embed.setColor(type == "RELEASE" ? "faa741" : "57a5cc");
  embed.setTitle(mod.name);
  embed.setURL(`https://nexusmods.com/${game}/mods/${mod.mod_id}`);
  embed.setDescription(mod.summary?.replace(/<br \/>/g, "\n").replace(/\n+/g, "\n"));
  embed.addField("Mod ID", mod.mod_id, true);
  embed.addField("Author", `[${mod.user.name}](https://nexusmods.com/${game}/users/${mod.user.member_id})`, true);
  embed.addField("Category", await getCategory(game, mod.category_id), true);
  embed.setImage(mod.picture_url ?? "");
  embed.setFooter(`v${mod.version}`);
  embed.setTimestamp(mod.created_timestamp * 1000);

  if (type == "UPDATE") {
    const changelogs = await nexus.getChangelogs(mod.mod_id, game);
    if (changelogs[mod.version] && changelogs[mod.version].length > 0) {
      embed.addField("Changelogs", `• ${changelogs[mod.version].join("\n• ")}`);
    }
  }

  return embed;
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