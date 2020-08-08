import { bot } from "../../../../src";
import * as modfeed from "../../src/mod_feed";

bot.on("ready", async () => {
  modfeed.updateModFeeds();
});