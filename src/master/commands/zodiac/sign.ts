import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Birthday from "../../../models/Birthday";
import config from "../../config";
import { getZodiacSign } from "../../misc/signs";
import { Sign, SlashCommand } from "../../misc/types";

const sign: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("sign")
        .setDescription("View your zodiac sign!")
        .addUserOption((option) => option
            .setName("target")
            .setDescription("The user you'd like to view")
            .setRequired(false)
    ),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {

        const { user, guildId, options } = interaction;

        const target = options.getUser("target");
        let embed = new EmbedBuilder();

        let zodiacSign: Sign;

        if (!target) {

            let birthdayData = await Birthday.findOne({
                UserID: user.id,
                GuildID: guildId
            });

            if (!birthdayData) {

                embed
                    .setColor(config.colors.error as ColorResolvable)
                    .setDescription("You must set your birthday in order to view your sign!")
                    .setFooter({
                        text: "/birthday set"
                    });
                
                return await interaction.reply({ embeds: [embed] });
            }

            let birthday = birthdayData.Birthday;
            
            zodiacSign = getZodiacSign(birthday);

            embed
                .setColor(config.colors.primary as ColorResolvable)
                .setTitle(zodiacSign.symbol)
                .setDescription(`**${zodiacSign.name}**\n\n\`${zodiacSign.startDate}\` — \`${zodiacSign.endDate}\``)
                .setAuthor({
                    name: interaction.user.displayName,
                    iconURL: interaction.user.avatarURL()
                });
            
            return await interaction.reply({ embeds: [embed] });
        }

        let birthdayData = await Birthday.findOne({
            UserID: target.id,
            GuildID: guildId
        });

        if (!birthdayData) {
            embed
                .setColor(config.colors.error as ColorResolvable)
                .setDescription("This user has not set their birthday!")
                .setFooter({
                    text: "/birthday set"
                });
            
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let birthday = birthdayData.Birthday;


        zodiacSign = getZodiacSign(birthday);

        embed
            .setColor(config.colors.primary as ColorResolvable)
            .setTitle(zodiacSign.symbol)
            .setDescription(`**${zodiacSign.name}**\n\n\`${zodiacSign.startDate}\` — \`${zodiacSign.endDate}\``)
            .setAuthor({
                name: target.displayName,
                iconURL: target.avatarURL()
            });
        
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

module.exports = sign;