import query from "../../lib/query";
import { SlashCommand } from "../../utils/types";
import { SlashCommandBuilder } from "discord.js";

const ai: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("Say or ask something to an AI")
        .addStringOption((option) => option
            .setName("prompt")
            .setDescription("The prompt to give")
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(500)
    ),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        const { guildId } = interaction;

        if (!interaction.isCommand()) return;

        const prompt = interaction.options.getString("prompt");

        // defer the reply to give the openai query time
        await interaction.deferReply().catch(() => null)
        
        const response = await query(prompt, guildId);

        if (response === undefined || response === null || !response) {
            return await interaction.editReply({ content: "An error occured" })
        }
        if (interaction.replied) {
            return;
        }
        if (interaction.deferred) {
            return await interaction.editReply({ content: response });
        }

        return;
    }
}

module.exports = ai;