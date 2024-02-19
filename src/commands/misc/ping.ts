import { SlashCommand } from "../../utils/types";
import { EmbedBuilder, SlashCommandBuilder, userMention, Colors } from "discord.js";

const ping: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping a user")
        .setDMPermission(false)
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you wish to ping")
            .setRequired(true),
    ),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        const options = interaction.options;
        const target = options.getUser("user");

        const embed = new EmbedBuilder()
            .setDescription(userMention(target.id))
            .setColor(Colors.Default)
        
        return await interaction.reply({ embeds: [embed] });
    },
}

module.exports = ping;