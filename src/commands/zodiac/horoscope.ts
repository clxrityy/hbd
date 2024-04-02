import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { QueryPrompt, Sign, SlashCommand } from "../../utils/types";
import Birthday from "../../models/Birthday";
import config from "../../config";
import { getZodiacSign } from "../../utils/signs";
import query from "../../lib/query";

const horoscope: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("horoscope")
        .setDescription("View your horoscope for the day").toJSON(),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        const { user, guildId } = interaction;

        let embed = new EmbedBuilder();

        let zodiacSign: Sign;

        let birthdayData = await Birthday.findOne({
            UserID: user.id,
            GuildID: guildId
        });

        if (!birthdayData) {
            embed
                .setColor(config.colors.error as ColorResolvable)
                .setDescription("You must set your birthday in order to view your horoscope!")
                .setFooter({
                    text: "/birthday set"
                });

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let birthday = birthdayData.Birthday;
        zodiacSign = getZodiacSign(birthday);
        let currentDate = Date.now();
        let date = new Date(currentDate);
        const month = date.getMonth();
        const day = date.getDay();
        const year = date.getFullYear();


        const queryPrompt: QueryPrompt = {
            userData: {
                username: user.username,
                id: user.id
            },
            guildId: guildId,
            sign: zodiacSign,
            birthday: birthday,
            currentDate: date
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

            return await interaction.reply({ embeds: [embed] });
        } catch (e) {
            return await interaction.reply(`An error occurred: \`${e}\``)
        }
    }
}

module.exports = horoscope;