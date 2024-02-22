import { Client, ColorResolvable, EmbedBuilder, TextChannel } from "discord.js";
import Birthday from "../../models/Birthday";
import Guild from "../../models/Guild";
import Config from "../../config";

module.exports = async (client: Client, ...args: string[]) => {

    const userId = args[0];

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

    const announceChannelId = guildData.AnnouncementChannel!;

    channel = await (await (await client.guilds.fetch(guildId)).channels.fetch(announceChannelId)).fetch() as TextChannel

    const embed = new EmbedBuilder()
        .setTitle("hbd! 🎉")
        .setDescription(`Happy birthday to <@!${userId}>!`)
        .setColor(Config.colors.primary as ColorResolvable)
        .setTimestamp()
        .setFooter({
            text: `/birthday set`,
            iconURL: client.user.avatarURL()
        });
    
    return await channel.send({ embeds: [embed] });
}