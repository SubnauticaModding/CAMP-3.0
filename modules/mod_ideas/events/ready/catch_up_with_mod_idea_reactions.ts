import { bot } from "../../../../src";
import ModIdea from "../../src/mod_idea";

bot.on("ready", async () => {
  const ideas = ModIdea.getAll().reverse();
  for (const idea of ideas) {
    const message = await idea.getMessage();
    if (!message) continue;

    console.log("Catching up with reactions on mod idea " + idea.id);

    const reactions = message.reactions.cache.array();
    for (const reaction of reactions) {
      const users = (await reaction.users.fetch()).array();
      for (const user of users) {
        bot.emit("messageReactionAdd", reaction, user);
      }
    }
  }
});