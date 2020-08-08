import { nexus } from "../../../common/nexus";
import ModIdea from "./mod_idea";

export function modIdea(id: string) {
  if (id.startsWith("#")) id = id.substr(1);
  if (parseInt(id).toString() != id) return;

  const modidea = ModIdea.get(parseInt(id));
  return modidea;
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