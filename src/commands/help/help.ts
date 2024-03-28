import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/types";
import config from "../../config";

const help: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help with the bot!"),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        let embed = new EmbedBuilder().setTitle("help").setURL("https://github.com/clxrityy/hbd?tab=readme-ov-file#-commands").setColor(config.colors.primary as ColorResolvable)
            .setDescription(`**ADMIN**\n- \`/config channels\` — Configure the announcement & command channel\n- \`/config roles\` — Configure the birthday & admin role\n\n**BIRTHDAY**\n- \`/birthday set\`\n- \`/birthday view\`\n- \`/hbd\``);
        
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

module.exports = help;