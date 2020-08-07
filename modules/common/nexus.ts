import nexusmods from "@nexusmods/nexus-api";
import config from "../../src/config";

export var nexus: nexusmods;

(async () => {
  console.log("Creating nexusmods object...")
  nexus = await nexusmods.create(process.env.NEXUS_API_KEY ?? "", "SNModding-CAMP-Bot", config.version, "subnautica");
  console.log("Nexusmods object created");
})();

export async function nexusLinkParser(link: string) {
  const matches = [...link.matchAll(/https?:\/\/(?:www\.)?nexusmods\.com\/(subnautica(?:belowzero)?)\/mods\/(\d+)\/?/g)];

  if (matches.length != 1) return;

  const game = matches[0][1];
  const id = matches[0][2];

  if ((game != "subnautica" && game != "subnauticabelowzero") || parseInt(id).toString() != id) return;

  const modinfo = await nexus.getModInfo(parseInt(id), game);
  return modinfo;
}