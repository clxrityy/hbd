import { Client, ColorResolvable, EmbedBuilder, TextChannel, userMention } from "discord.js";
import Birthday from "../../models/Birthday";
import Guild from "../../models/Guild";
import Config from "../../config";

module.exports = async (client: Client, ...args: string[]) => {

    const userId = args[0][0];
    

    const birthdayData = await Birthday.findOne({ UserID: userId });

    if (!birthdayData) {
        return;
    }

    const guildId = birthdayData.GuildID;

    const guildData = await Guild.findOne({ GuildID: guildId });

    if (!guildData) {
        return;
    }
    let channel: TextChannel;

    const announceChannelId = guildData.AnnouncementChannel;

    if (!announceChannelId) {
        channel = await (await client.guilds.fetch(guildId)).channels.fetch()[0] as TextChannel;
    }

    let message = guildData.AnnouncementMessage;

    let embed = new EmbedBuilder()
        .setTitle(Config.messages.happyBirthdayAnnouncement.title)
        .setDescription(`Happy birthday to <@!${userId}>!`)
        .setColor(Config.colors.primary as ColorResolvable)
        .setFooter(Config.messages.happyBirthdayAnnouncement.footer);

    channel = await (await (await client.guilds.fetch(guildId)).channels.fetch(announceChannelId)).fetch() as TextChannel;

    if (!message) {
        return await channel.send({ embeds: [embed] });
    } else {
        message = message.replace("{{user}}", `${userMention(userId)}`);
        return await channel.send({ content: message });
    }
}