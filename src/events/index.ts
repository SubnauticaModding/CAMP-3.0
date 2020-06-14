import { bot } from "../..";
import * as message from "./message";
import * as messageDelete from "./messageDelete";
import * as messageReactionAdd from "./messageReactionAdd";
import * as messageReactionRemove from "./messageReactionRemove";
import * as ready from "./ready";

for (var str in message) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("message", message[str]);
}

for (var str in messageDelete) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("messageDelete", messageDelete[str]);
}

for (var str in messageReactionAdd) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("messageReactionAdd", messageReactionAdd[str]);
}

for (var str in messageReactionRemove) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("messageReactionRemove", messageReactionRemove[str]);
}

for (var str in ready) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("ready", ready[str]);
}
