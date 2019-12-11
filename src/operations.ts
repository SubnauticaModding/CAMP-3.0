import * as Discord from "discord.js";
import config from "../config.json";
import { ModIdea } from "./classes/modIdea.js";
import { readData, writeData } from "./data";
import { editModIdea, getModIdeaFromMessage } from "./modIdeas.js";
import { isIdeasManager } from "./perms.js";
import { getMessage } from "./util.js";

export async function startOperation(user: Discord.User, message: Discord.Message) {
  const operations = readData("operations", []) as any[];
  operations.push({
    channel: message.channel.id,
    message: message.id,
    time: Date.now() + (config.OPERATION_TIME * 1000),
    user: user.id,
  });
  writeData("operations", operations);

  const idea = getModIdeaFromMessage(message);
  if (idea) {
    editModIdea(idea, message, user.id);
    await message.clearReactions();
    if (user.id === idea.author) await message.react(config.EMOJIS.EDIT.EDIT);
    if (isIdeasManager(user)) await message.react(config.EMOJIS.EDIT.APPROVE);
    if (isIdeasManager(user) || user.id === idea.author) await message.react(config.EMOJIS.EDIT.REMOVE);
    if (isIdeasManager(user)) await message.react(config.EMOJIS.EDIT.DUPLICATE);
    message.react(config.EMOJIS.EDIT.CANCEL);
  }
}

export async function stopOperation(user: string | Discord.User, message: Discord.Message) {
  if (user instanceof Discord.User) user = user.id;
  let operations = readData("operations", []) as any[];
  operations = operations.filter((o) => o.user !== user && o.message !== message);
  writeData("operations", operations);
  if (getMessage(message.id)) {
    editModIdea(getModIdeaFromMessage(message) as ModIdea, message);
    await message.clearReactions();
    await message.react(config.EMOJIS.VOTE.UPVOTE);
    await message.react(config.EMOJIS.VOTE.ABSTAIN);
    await message.react(config.EMOJIS.VOTE.DOWNVOTE);
    message.react(config.EMOJIS.VOTE.EDIT);
  }
}

export async function stopAllOperations() {
  for (const operation of await getOperations()) {
    stopOperation(operation.user, operation.message);
  }
}

export async function getOperation(prop: Discord.Message | Discord.User): Promise<{
  user: string,
  message: Discord.Message,
  channel: Discord.TextChannel,
  time: number,
} | false> {
  if (prop instanceof Discord.Message) {
    const operations = readData("operations", []) as any[];
    const op = operations.filter((o) => o.message === prop.id)[0];
    if (!op) return false;
    op.message = prop;
    op.channel = prop.channel;
    return op;
  } else {
    const operations = readData("operations", []) as any[];
    const op = operations.filter((o) => o.user === prop.id)[0];
    if (!op) return false;
    op.message = await getMessage(op.message);
    op.channel = op.message.channel;
    return op;
  }
}

export async function getOperations(): Promise<Array<{
  user: string,
  message: Discord.Message,
  channel: Discord.TextChannel,
  time: number,
}>> {
  const op = readData("operations", []) as any[];
  for (const operation of op) {
    operation.messageid = operation.message;
    operation.message = await getMessage(operation.messageid, operation.channel);
  }
  for (const operation of op.filter((o) => o.message === false)) {
    stopOperation(operation.user, operation.messageid);
  }
  return op.filter((o) => o.message !== false);
}
