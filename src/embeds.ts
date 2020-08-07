import Discord from "discord.js";
import * as util from "./util";

/**
 * Generates a success message embed and deletes it afterwards
 * @param message The message which triggered the embed
 * @param text The text of the embed
 * @param time The time after which to delete the embed.
 * 
 * Defaults to `10` seconds.
 */
export async function success(message: Discord.Message, text: string, time = 10) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    title: "Success",
    description: text,
    color: "GREEN"
  }));

  await util.wait(time);

  message.delete({ reason: "Command invocation message deleted." });
  replymsg.delete({ reason: "Command reply message deleted." });
}

/**
 * Generates a warning message embed and deletes it afterwards
 * @param message The message which triggered the embed
 * @param text The text of the embed
 * @param time The time after which to delete the embed.
 * 
 * Defaults to `10` seconds.
 */
export async function warn(message: Discord.Message, text: string, time = 10) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    title: "Warning",
    description: text,
    color: "GOLD"
  }));

  await util.wait(time);

  message.delete({ reason: "Command invocation message deleted." });
  replymsg.delete({ reason: "Command reply message deleted." });
}

/**
 * Generates an error message embed and deletes it afterwards
 * @param message The message which triggered the embed
 * @param text The text of the embed
 * @param time The time after which to delete the embed.
 * 
 * Defaults to `10` seconds.
 */
export async function error(message: Discord.Message, text: string, time = 10) {
  const replymsg = await message.channel.send(new Discord.MessageEmbed({
    title: "Error",
    description: text,
    color: "RED"
  }));

  await util.wait(time);

  message.delete({ reason: "Command invocation message deleted." });
  replymsg.delete({ reason: "Command reply message deleted." });
}
