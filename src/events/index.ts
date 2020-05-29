import { bot } from "../..";

import * as message from "./message";
for (var str in message) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("message", message[str]);
}

import * as messageDelete from "./messageDelete";
for (var str in messageDelete) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("messageDelete", messageDelete[str]);
}

import * as messageReactionAdd from "./messageReactionAdd";
for (var str in messageReactionAdd) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("messageReactionAdd", messageReactionAdd[str]);
}

import * as ready from "./ready";
for (var str in ready) {
  // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
  bot.on("ready", ready[str]);
}
