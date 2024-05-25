import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../misc/types";

const avatar: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Fetch a user's avatar")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you'd like to fetch")
            .setRequired(false)
        ),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        const { options } = interaction;

        const target = options.getUser("user", false);
        
        if (target) {
            const avatar = target.avatarURL();
            let embed = new EmbedBuilder().setImage(avatar);

            return await interaction.reply({ embeds: [embed] });
        }

        const avatar = interaction.user.avatarURL();

        let embed = new EmbedBuilder().setImage(avatar);

        return await interaction.reply({ embeds: [embed] });

        
    },
}

module.exports = avatar;