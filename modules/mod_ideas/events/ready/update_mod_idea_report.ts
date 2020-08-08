import { bot } from "../../../../src";
import ModIdea from "../../src/mod_idea";

bot.on("ready", async () => {
  ModIdea.updateReportMessage();
});