import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/types";
import Config from "../../config";
import "colors";
import config from "../../config";

const bot: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Manage the bot (developers only)")
        .addSubcommandGroup((group) => group
            .setName("settings")
            .setDescription("The bot's settings")
            .addSubcommand((sub) => sub
                .setName("avatar")
                .setDescription("The bot's avatar")
                .addStringOption((option) => option
                    .setName("avatar_url")
                    .setDescription("The URL of an image/gif")
                    .setRequired(true)
                )
            )
        )
    .toJSON(),
    botPermissions: [],
    userPermissions: [],
    run: async (client, interaction) => {
        if (!config.developerIds.includes(interaction.user.id)) return;

        const { options } = interaction;

        const subCommandGroup = options.getSubcommandGroup();

        if (!subCommandGroup) return;

        const subCommand = options.getSubcommand();

        let embed = new EmbedBuilder();

        switch (subCommandGroup) {
            case "settings":
                switch (subCommand) {
                    case "avatar":
                        const avatarUrl = options.getString("avatar_url");

                        if (!avatarUrl) return;

                        try {
                            await client.user.setAvatar(avatarUrl);

                            embed
                                .setColor(Config.colors.success as ColorResolvable)
                                .setDescription("Successfully updated the bot's avatar!")
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                })
                                .setThumbnail(avatarUrl)
                                .setTimestamp()
                                .setFooter({
                                    text: `/bot`
                                })
                            
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        } catch (err) {
                            console.log(`[ERROR] Error running /bot settings avatar!\n${err}`.red);

                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`There was an error attempting to update the bot's avatar!\n\n${err}`)
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                })
                                .setTimestamp()
                                .setFooter({
                                    text: "See the console for errors"
                                })
                            
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                }
        }
    },
}

module.exports = bot;