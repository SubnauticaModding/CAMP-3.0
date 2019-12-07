import { UserResolvable } from "discord.js";

import { guild } from "..";

export function isIdeasManager(user: UserResolvable) {
  user = guild().member(user);
  return [...user.roles.values()].map(r => r.name)
}