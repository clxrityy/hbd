import { Client, ColorResolvable, EmbedBuilder, TextChannel, userMention } from "discord.js";
import Birthday from "../../models/Birthday";
import Guild from "../../models/Guild";
import Config from "../../config";

module.exports = async (client: Client, ...args: string[]) => {

    const userId = args[0][0];
    const guildId = args[0][1];

    const birthdayData = await Birthday.findOne({ UserID: userId });

    if (!birthdayData) {
        return;
    }

    const guildData = await Guild.findOne({ GuildID: guildId });
    let channel: TextChannel;

    if (!guildData) {
        channel = await (await client.guilds.fetch(guildId)).channels.fetch()[0] as TextChannel;
    }
    
    const announceChannelId = guildData.AnnouncementChannel;

    if (!announceChannelId) {
        channel = await (await client.guilds.fetch(guildId)).channels.fetch()[0] as TextChannel;
    } else {
        channel = await (await client.guilds.fetch(guildId)).channels.fetch(announceChannelId) as TextChannel;
    }

    let message = guildData.AnnouncementMessage;

    let embed = new EmbedBuilder()
        .setTitle(Config.messages.happyBirthdayAnnouncement.title)
        .setDescription(`Happy birthday to <@!${userId}>!`)
        .setColor(Config.colors.primary as ColorResolvable)
        .setFooter(Config.messages.happyBirthdayAnnouncement.footer);

    try {
        if (!message) {
            await channel.send({ embeds: [embed] });
            console.log(`[INFO] Sent birthday announcement to ${channel.guild.name}`.green);
        } else {
            message = message.replace("{{user}}", `${userMention(userId)}`);
            await channel.send({ content: message });
            console.log(`[INFO] Sent birthday announcement to ${channel.guild.name}`.green);
        }
    } catch (error) {
        console.error(`[ERROR] Failed to send birthday announcement: ${error}`.red);
    }
}