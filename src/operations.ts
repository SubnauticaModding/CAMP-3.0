import * as Discord from "discord.js";
import config from "../config.json";
import { readData, writeData } from "./data";
import { getMessage } from "./util.js";

export async function startOperation(user: string | Discord.User, message: Discord.Message) {
  if (user instanceof Discord.User) user = user.id;
  const operations = readData("operations") as any[] || [];
  operations.push({ user, message: message.id, time: Date.now() });
  writeData("operations", operations);
  await message.react(config.EMOJIS.EDIT.APPROVE);
  await message.react(config.EMOJIS.EDIT.REMOVE);
  message.react(config.EMOJIS.EDIT.DUPLICATE);
}

export function stopOperation(user: string | Discord.User, message: Discord.Message) {
  if (user instanceof Discord.User) user = user.id;
  let operations = readData("operations") as any[] || [];
  operations = operations.filter((o) => o.user !== user && o.message !== message);
  writeData("operations", operations);
  message.reactions.filter((m) =>
    m.emoji.toString() === config.EMOJIS.EDIT.APPROVE ||
    m.emoji.toString() === config.EMOJIS.EDIT.REMOVE ||
    m.emoji.toString() === config.EMOJIS.EDIT.DUPLICATE,
  ).forEach((m) => m.remove());
}

export function getOperation(message: Discord.Message): {
  user: string,
  message: Discord.Message,
  time: number,
} {
  const operations = readData("operations") as any[] || [];
  const op = operations.filter((o) => o.message = message.id)[0];
  op.message = message;
  return op;
}

export async function getOperations(): Promise<Array<{
  user: string,
  message: Discord.Message,
  time: number,
}>> {
  const op = readData("operations") as any[];
  for (const operation of op) {
    operation.messageid = operation.message;
    operation.message = await getMessage(operation.message);
  }
  for (const operation of op.filter((o) => o.message === true)) {
    stopOperation(operation.user, operation.messageid);
  }
  return op.filter((o) => o.message !== false);
}
