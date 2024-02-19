import "colors";
import { Client, ColorResolvable, CommandInteraction, EmbedBuilder } from "discord.js";
import { getLocalCommands } from "../../utils/getCommands";
import { SlashCommand } from "../../utils/types";
import config from "../../config";

module.exports = async (client: Client, interaction: CommandInteraction) => {

    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();
    const commandObject: SlashCommand = localCommands.find((cmd: SlashCommand) => cmd.data.name === interaction.commandName);

    if (!commandObject) return;

    const createEmbed = (color: string | ColorResolvable, description: string) => new EmbedBuilder()
        .setColor(color as ColorResolvable)
        .setDescription(description);
    
    for (const permission of commandObject.userPermissions || []) {
        if (!interaction.memberPermissions.has(permission)) {
            const embed = createEmbed(config.colors.error, "You do not have permission to execute this command!");

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    const bot = interaction.guild.members.me;

    for (const permission of commandObject.botPermissions || []) {
        if (!bot.permissions.has(permission)) {
            const embed = createEmbed(config.colors.error, "I don't have permission to execute this command!");

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    try {
        await commandObject.run(client, interaction);
    } catch (err) {
        console.log(`[ERROR] An error occured while validating commands!\n ${err}`.red);
        console.error(err);
    }
}