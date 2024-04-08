import { ColorResolvable, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import { SlashCommand } from "../../misc/types";
import config from "../../config";

const emit: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Manually emit an event")
        .addStringOption((option) => option
            .setName("event")
            .setDescription("The event to emit")
            .setRequired(true)
    )
        .addUserOption((option) => option
            .setName("target")
            .setDescription("The target user")
            .setRequired(false))
        .toJSON(),
    botPermissions: [],
    userPermissions: [],
    run: async (client, interaction) => {
        if (!config.developerIds.includes(interaction.user.id)) return;

        const { options, guildId } = interaction;

        const event = options.getString("event", true);
        const target = options.getUser("target", false);

        let embed = new EmbedBuilder();

        switch (event) {

            case "birthday":
                if (!target) {
                    embed.setDescription("Please provide a target user").setColor(config.colors.error as ColorResolvable);

                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                client.emit("birthday", [target.id, guildId]);
                embed.setDescription(`Manually emitted the **birthday** event for guild \`${guildId}\` & user ${userMention(target.id)}`).setColor(config.colors.success as ColorResolvable);

                return await interaction.reply({ embeds: [embed] });
            default:
                break;
        }
    }
}

module.exports = emit;