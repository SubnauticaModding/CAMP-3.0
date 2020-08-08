import Discord from "discord.js";
import fs from "fs";
import readdir from "fs-readdir-recursive";
import path from "path";
import CommandPermission from "./command_permission";
import config from "./config";

/**
 * Imports all files from the specified folder and its subfolders
 */
export function importAll(dirPath: string) {
  console.log(`Importing all files at ${dirPath}`);
  const files = readdir(dirPath);

  for (const file of files) {
    console.log(`Checking ${path.join(dirPath, file)}...`);
    if (file.endsWith("index.js")) continue;
    if (!file.endsWith(".js")) continue;
    console.log(`Importing ${path.join(dirPath, file)}...`);
    import(path.join(dirPath, file.substr(0, file.length - 3)));
  }
}

/**
 * Makes sure that the provided directories exist.
 */
export function ensureFolders(...p: string[]) {
  var currentPath = "";
  for (var newPath of p) {
    if (!currentPath) currentPath = newPath;
    else currentPath = path.join(currentPath, newPath);
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
  }
}

/**
 * Waits for a number of seconds
 * @param s Number of seconds to wait for
 */
export function wait(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
}

/**
 * Waits until a criteria is met
 * @param func The function to call in order to check if the criteria has been met.
 * 
 * If this returns `true`, the program continues.
 * 
 * If this returns `false`, the function is called again in `100` milliseconds.
 */
export function waitUntil(func: () => true | false | undefined): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (func()) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

/**
 * Gets the `CommandPermission` of a member
 */
export function getPermission(member: Discord.GuildMember | null): CommandPermission {
  if (!member) return CommandPermission.User;
  if (member.id == "183249892712513536") return CommandPermission.Developer;
  if (member.hasPermission("ADMINISTRATOR")) return 10;

  var maxPermission = 0;
  const roles = member.roles.cache.array().map(r => r.id);
  for (var permission in config.permissions) {
    // @ts-ignore 7053 - No index signature with a parameter of type 'string' was found on type '...'
    if (roles.includes(config.permissions[permission])) {
      maxPermission = Math.max(maxPermission, parseInt(permission));
    }
  }

  return maxPermission;
}

/**
 * Returns all messages from in a text channel
 */
export async function getAllMessages(channel: Discord.TextChannel) {
  const messages: Discord.Message[] = [];
  var before = undefined;

  while (true) {
    try {
      var fetchedMessages = (await channel.messages.fetch({
        before: before,
        limit: 100,
      })).array();

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
