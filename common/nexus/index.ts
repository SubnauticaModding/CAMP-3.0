import nexusmods from "@nexusmods/nexus-api";
import path from "path";
import config from "../../src/config";
import { importAll } from "../../src/util";

importAll(path.join(__dirname, "./commands"));

console.log("Loading common module nexus...");

export var nexus: nexusmods;

(async () => {
  console.log("Creating nexusmods object...")
  nexus = await nexusmods.create(process.env.NEXUS_API_KEY ?? "", "SNModding-CAMP-Bot", config.version, "subnautica");
  console.log("Nexusmods object created");
})();

