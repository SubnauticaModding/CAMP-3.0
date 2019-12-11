import { UserResolvable } from "discord.js";

import { guild } from "..";
import config from "../config.json";

export function isIdeasManager(user: UserResolvable) {
  return isModerator(user) || checkRole(user, config.ROLES.MOD_IDEAS_MANAGER);
}

export function isModerator(user: UserResolvable) {
  return isStaff(user) || checkRole(user, config.ROLES.MODERATOR);
}

export function isStaff(user: UserResolvable) {
  return checkRole(user, config.ROLES.STAFF);
}

function checkRole(user: UserResolvable, permission: string) {
  user = guild().member(user);
  if ([...user.roles.values()].filter((r) => r.id === permission).length > 0) return true;
  if (user.permissions.toArray().filter((p) => p === permission).length > 0) return true;
  return false;
}
