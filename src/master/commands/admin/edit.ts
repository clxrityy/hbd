import "colors";
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import Birthday from "../../../models/Birthday";
import config from "../../config";
import { SlashCommand } from "../../misc/types";

const edit: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("edit")
        .setDescription("Edit a user's birthday (admin)")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The target user")
            .setRequired(true)
        )
        .addNumberOption((option) => option
            .setName("month")
            .setDescription("The desired month (1 - 12)")
            .setMinValue(1)
            .setMaxValue(12)
            .setRequired(true)
        )
        .addNumberOption((option) => option
            .setName("day")
            .setDescription("The desired day (1 - 31")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(31)
    ).toJSON(),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        const { guildId, options } = interaction;
    
        const user = options.getUser("user", true);
        const month = options.getNumber("month", true);
        const day = options.getNumber("day", true);

        let birthdayData = await Birthday.findOne({ GuildID: guildId, UserID: user.id });

        let embed = new EmbedBuilder()

        if (!birthdayData) {
            embed
                .setColor(config.colors.error as ColorResolvable)
                .setDescription(`${userMention(user.id)} has not set their birthday!`);

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            await birthdayData.updateOne({
                Birthday: `${month}/${day}`
            });

            await birthdayData.save();

            embed
                .setColor(config.colors.success as ColorResolvable)
                .setDescription(`Successfully changed ${userMention(user.id)}'s birthday!`)
                .setFooter({
                    text: "/birthday view",
                    iconURL: client.user.avatarURL()
                });
            
            return await interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.log(`[ERROR] An error occured attempting to edit a user's birthday!\n${err}`.red);

            embed
                .setColor(config.colors.error as ColorResolvable)
                .setDescription(`**Error**\n\n\`${err}\``)
            
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

module.exports = edit;