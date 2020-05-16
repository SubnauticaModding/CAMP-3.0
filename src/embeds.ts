import Discord from "discord.js";

import * as util from "./util";

export async function success(message: Discord.Message, text: string, time = 10) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    title: "Success",
    description: text,
    color: "GREEN"
  }));

  await util.wait(time);

  message.delete();
  replymsg.delete();
}

export async function warn(message: Discord.Message, text: string, time = 10) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    title: "Warning",
    description: text,
    color: "GOLD"
  }));

  await util.wait(time);

  message.delete();
  replymsg.delete();
}

export async function error(message: Discord.Message, text: string, time = 10) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    title: "Error",
    description: text,
    color: "RED"
  }));

  await util.wait(time);

  message.delete();
  replymsg.delete();
}
