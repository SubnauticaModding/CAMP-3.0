import Discord from "discord.js";

declare module 'discord.js' {
  interface Message {
    crosspost(): Promise<void>;
  }
}

Discord.Message.prototype.crosspost = async function () {
  (this.client['api'] as any).channels(this.channel.id).messages(this.id).crosspost.post();
}