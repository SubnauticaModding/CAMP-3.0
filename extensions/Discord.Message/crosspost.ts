// discord.js hasn't added a crosspost function yet
// "crossposting" == publishing messages in an announcement channel

import Discord from "discord.js";

declare module 'discord.js' {
  interface Message {
    /**
     * Publishes a messasge in an announcement channel.
     * @this {Discord.Message}
     * @param errorOnNoAnnouncementChannel Whether or not to throw an error if the channel of the message is not an announcement channel.
     * 
     * Defaults to `false`
     */
    crosspost(errorOnNoAnnouncementChannel?: boolean): Promise<void>;
  }
}

Discord.Message.prototype.crosspost = async function (errorOnNoAnnouncementChannel = false) {
  if (this.channel.type != "news") {
    if (errorOnNoAnnouncementChannel) throw new Error("The channel you are trying to publish a message in is not an announcement channel! (" + this.channel.id + ")");
    else return;
  }
  (this.client['api'] as any).channels(this.channel.id).messages(this.id).crosspost.post();
}