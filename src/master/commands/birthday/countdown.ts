import { ColorResolvable, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import config from "../../../config";
import Birthday from "../../../models/Birthday";
import { timeLeft } from "../../misc/time";
import { SlashCommand } from "../../misc/types";

const countdown: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("countdown")
        .setDescription("Countdown to your birthday")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user to countdown to")
            .setRequired(false)
        ),
    botPermissions: [],
    userPermissions: [],
    run: async (client, interaction) => {
        const { user, guildId, options } = interaction;

        const target = options.getUser("user");
        let embed = new EmbedBuilder();

        if (!target) {
            
            let bithdayData = await Birthday.findOne({
                GuildID: guildId,
                UserID: user.id
            });

            if (!bithdayData) {
                embed
                    .setColor(config.colors.error as ColorResolvable)
                    .setDescription("You must set your birthday in order to view your countdown!")
                    .setFooter({
                        text: "/birthday set"
                    });

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            let birthday = bithdayData.Birthday;

            const remainingDays = timeLeft(birthday);

            embed
                .setColor(config.colors.primary as ColorResolvable)
                .setDescription(`There are **${remainingDays}** days left until your birthday!`);
            
            return await interaction.reply({ embeds: [embed] });
        }

        let bithdayData = await Birthday.findOne({
            GuildID: guildId,
            UserID: target.id
        });

        if (!bithdayData) {
            embed
                .setColor(config.colors.error as ColorResolvable)
                .setDescription("This user has not set their birthday!")
                .setFooter({
                    text: "/birthday set"
                });

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let birthday = bithdayData.Birthday;

        const remainingDays = timeLeft(birthday);

        embed
            .setColor(config.colors.primary as ColorResolvable)
            .setDescription(`There are **${remainingDays}** days left until ${userMention(target.id)}'s birthday!`);
        
        return await interaction.reply({ embeds: [embed] });
    }
}

module.exports = countdown;