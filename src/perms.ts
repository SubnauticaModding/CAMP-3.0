import { UserResolvable } from "discord.js";

import { guild } from "..";
import CONSTS from "./consts";

export function isIdeasManager(user: UserResolvable) {
  user = guild().member(user);
  return [...user.roles.values()].filter(r => r.id == CONSTS.ROLES.MOD_IDEAS_MANAGER).length > 0;
}

export function isModerator(user: UserResolvable) {
  user = guild().member(user);
  return [...user.roles.values()].filter(r => r.id == CONSTS.ROLES.MODERATOR).length > 0;
}

export function isStaff(user: UserResolvable) {
  user = guild().member(user);
  return user.hasPermission("ADMINISTRATOR");
}