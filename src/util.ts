import Discord from "discord.js";
import fs from "fs";
import path from "path";

import config from "./config";
import CommandPermission from "./data_types/command_permission";

export function ensureFolders(...p: string[]) {
  var currentPath;
  for (var newPath of p) {
    if (!currentPath) currentPath = newPath;
    else currentPath = path.join(currentPath, newPath);
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
  }
}

export function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

export function getPermission(member: Discord.GuildMember | null): CommandPermission {
  if (!member) return CommandPermission.User;
  if (member.id == "183249892712513536") return CommandPermission.Developer;
  if (member.hasPermission("ADMINISTRATOR")) return 10;

  var maxPermission = 0;
  const roles = [...member.roles.cache.values()].map(r => r.id);
  for (var permission in config.permissions) {
    // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
    if (roles.includes(config.permissions[permission])) {
      maxPermission = Math.max(maxPermission, parseInt(permission));
    }
  }

  return maxPermission;
}

export async function getAllMessages(channel: Discord.TextChannel) {
  const messages: Discord.Message[] = [];
  var before = undefined;

  while (true) {
    try {
      var fetchedMessages = [...(await channel.messages.fetch({
        before: before,
        limit: 100,
      })).values()];

      if (!fetchedMessages || fetchedMessages.length == 0) break;

      for (var message of fetchedMessages) {
        messages.unshift(message);
      }

      before = messages[0].id;

      if (fetchedMessages.length != 100) break;
    } catch {
      break;
    }
  }

  return messages;
}

declare global {
  interface String {
    replaceAsync(regexp: RegExp, func: (substring: string, ...args: any[]) => Promise<string>): Promise<string>;
  }
}

String.prototype.replaceAsync = async function (regex: RegExp, func: (substring: string, ...args: any[]) => Promise<string>): Promise<string> {
  const promises: Promise<string>[] = [];
  this.replace(regex, (substring, ...args) => {
    const promise = func(substring, ...args);
    promises.push(promise);
    return substring;
  });
  const data = await Promise.all(promises);
  return this.replace(regex, (substring) => data.shift() ?? substring);
}