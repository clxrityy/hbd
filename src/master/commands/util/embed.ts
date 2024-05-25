import { ColorResolvable, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../../misc/types";

const embed: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Send an embed to a channel")
        .addStringOption((option) => option
            .setName("content")
            .setDescription("The message content (optional)")
        )
        .addStringOption((option) => option
            .setName("title")
            .setDescription("The embed title")
            .setMaxLength(256)
        )
        .addStringOption((option) => option
            .setName("description")
            .setDescription("The embed description (supports formatting)")
            .setMaxLength(4096)
        )
        .addStringOption((option) => option
            .setName("url")
            .setDescription("The embed title link")
        )
        .addStringOption((option) => option
            .setName("image")
            .setDescription("The embed image URL")
        )
        .addStringOption((option) => option
            .setName("thumbnail")
            .setDescription("The embed thumbnail URL")
        )
        .addBooleanOption((option) => option
            .setName("timestamp")
            .setDescription("If the embed should contain a timestamp")
        )
        .addStringOption((option) => option
            .setName("color")
            .setDescription("The embed color (ex. #ffffff)")
            .setMaxLength(7)
            .setMinLength(7)
        )
        .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The designated channel for the embed")
        ),
    botPermissions: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    run: async (client, interaction) => {

        const { options } = interaction;

        const title = options.getString("title");
        const description = options.getString("description");
        const url = options.getString("url");
        const image = options.getString("image");
        const thumbnail = options.getString("thumbnail");
        const timestamp = options.getBoolean("timestamp");
        const color = options.getString("color");
        const content = options.getString("content");

        let channel: TextChannel = options.getChannel("channel") as TextChannel;

        const embed = new EmbedBuilder();

        title && embed.setTitle(title);
        description && embed.setDescription(description);
        url && embed.setURL(url);
        image && embed.setImage(image);
        thumbnail && embed.setThumbnail(thumbnail);
        timestamp && embed.setTimestamp();
        color && color.startsWith("#") && embed.setColor(color as ColorResolvable);

        if (!channel) {
            channel = interaction.channel as TextChannel;
        }

        return await channel.send({ embeds: [embed], content: content && content });
    }
}

module.exports = embed;