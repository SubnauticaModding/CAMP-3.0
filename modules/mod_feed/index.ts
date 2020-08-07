import * as ModFeed from "./src/mod_feed";

setInterval(() => {
  ModFeed.updateModFeeds();
}, 300000); // 5 minutes