import Discord from "discord.js";

import * as util from "./util";

export async function error(message: Discord.Message, text: string) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    description: text,
    color: "RED"
  }));

  await util.wait(10);

  message.delete();
  replymsg.delete();
}

export async function success(message: Discord.Message, text: string) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    description: text,
    color: "GREEN"
  }));

  await util.wait(10);

  message.delete();
  replymsg.delete();
}