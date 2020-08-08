import path from "path";
import { importAll } from "../../src/util";
import * as ModFeed from "./src/mod_feed";

importAll(path.join(__dirname, "./events"));

setInterval(() => {
  ModFeed.updateModFeeds();
}, 300000); // 5 minutes