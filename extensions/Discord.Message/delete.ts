import Discord from "discord.js";

const defaultDelete = Discord.Message.prototype.delete;

Discord.Message.prototype.delete = async function (options?: { timeout?: number, reason?: string }): Promise<Discord.Message> {
  try {
    return await defaultDelete.call(this, options);
  } catch (e) {
    const error: Error = e;
    // @ts-ignore 2322
    if (error.name == "DiscordAPIError" && error.message.toLowerCase().includes("unknown message")) return;
    throw e;
  }
}