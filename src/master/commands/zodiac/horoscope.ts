import "colors";
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { cooldowns } from "../../..";
import config from "../../../config";
import Birthday from "../../../models/Birthday";
import query from "../../lib/query";
import { getZodiacSign } from "../../misc/signs";
import { QueryPrompt, Sign, SlashCommand } from "../../misc/types";

const horoscope: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("horoscope")
        .setDescription("View your horoscope for the day").toJSON(),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        const cooldownAmount = 1000 * 60 * 60 * 12; // 12 hours

        const { user, guildId } = interaction;

        let embed = new EmbedBuilder();

        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id)! + cooldownAmount;

            if (Date.now() < expirationTime) {


                let timeLeft = (expirationTime - Date.now()) / 1000;
                let timeLeftTime = "s";

                if (timeLeft > 1000) {
                    timeLeft = timeLeft / 60;
                    timeLeftTime = "m";
                }

                embed.setDescription(`You can only check your horoscope once every 12 hours!`)
                    .setColor(config.colors.error as ColorResolvable)
                    .setFooter({
                        text: `${timeLeft.toFixed(0)}${timeLeftTime} left`
                    });
                const reply = await interaction.reply({ embeds: [embed] });
                return setTimeout(async () => {
                    await reply.delete();
                }, 5000);
            }
        } else {
            cooldowns.set(interaction.user.id, Date.now());
            setTimeout(() => cooldowns.delete(interaction.user.id), cooldownAmount);
        }

        let zodiacSign: Sign;

        let birthdayData = await Birthday.findOne({
            UserID: user.id,
            GuildID: guildId
        });

        await interaction.deferReply().catch(() => null);

        if (!birthdayData) {
            embed
                .setColor(config.colors.error as ColorResolvable)
                .setDescription("You must set your birthday in order to view your horoscope!")
                .setFooter({
                    text: "/birthday set"
                });

            return await interaction.editReply({ embeds: [embed] });
        }

        let birthday = birthdayData.Birthday;
        zodiacSign = getZodiacSign(birthday);
        let currentDate = Date.now();
        let date = new Date(currentDate);
        const month = date.getMonth() + 1;
        const day = date.getUTCDate();
        const year = date.getFullYear();
        const dateCorrected = new Date();
        dateCorrected.setMonth(month);
        dateCorrected.setUTCDate(day);
        dateCorrected.setFullYear(year);

        const queryPrompt: QueryPrompt = {
            userData: {
                username: user.username,
                id: user.id
            },
            guildId: guildId,
            sign: zodiacSign,
            birthday: birthday,
            currentDate: dateCorrected
        }

        try {
            const response = await query(queryPrompt);

            embed
                .setColor(config.colors.primary as ColorResolvable)
                .setDescription(`**${zodiacSign.symbol} \`${month}/${day}/${year}\`**\n\n${response}`)
                .setAuthor({
                    name: user.username,
                    iconURL: user.avatarURL()
                });

            if (response === undefined || response === null || !response) {
                embed.setDescription("An error occurred while fetching your horoscope! Please try again later.")
                    .setColor(config.colors.error as ColorResolvable);

                if (interaction.replied) {
                    return;
                }
                if (interaction.deferred) {
                    return await interaction.editReply({ embeds: [embed] });
                }
            }

            if (interaction.replied) {
                return;
            }
            if (interaction.deferred) {
                return await interaction.editReply({ embeds: [embed] });
            }
            return;
        } catch (e) {
            console.log(`[ERROR] Error getting horoscope for ${user.id}\n${e}`.red)
            if (interaction.replied) {
                return;
            }
            if (interaction.deferred) {
                return await interaction.reply(`An error occurred: \n\`\`\`${e}\`\`\``)
            }
            return;
        }
    }
}

module.exports = horoscope;