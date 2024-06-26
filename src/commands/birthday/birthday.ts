import "colors";
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import Config from "../../config";
import { getMonth } from "../../misc/bdayUtil";
import { BirthdayData, SlashCommand } from "../../misc/types";
import Birthday from "../../models/Birthday";
import Guild from "../../models/Guild";

const birthday: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Birthday commands")
        .addSubcommand((sub) => sub
            .setName("set")
            .setDescription("Set your birthday!")
            .addNumberOption((option) => option
                .setName("month")
                .setDescription("The month you were born (1 - 12)")
                .setMinValue(1)
                .setMaxValue(12)
                .setRequired(true)
            )
            .addNumberOption((option) => option
                .setName("day")
                .setDescription("The day you were born (1 - 31")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31)
            )

        )
        .addSubcommand((sub) => sub
            .setName("view")
            .setDescription("View a user's birthday")
            .addUserOption((option) => option
                .setName("target")
                .setDescription("The user you'd like to view")
                .setRequired(false)
            )
        ).addSubcommand((sub) => sub
            .setName("list")
            .setDescription("List guild birthdays")
            .addNumberOption((option) => option
                .setName("month")
                .setDescription("List by month")
                .setRequired(false)
            )

        )
        .toJSON(),
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {

        const { guildId, options } = interaction;

        const subCommand = options.getSubcommand();

        const embed = new EmbedBuilder();

        let birthdayData = await Birthday.findOne({
            UserID: interaction.user.id,
            GuildID: guildId
        });

        switch (subCommand) {
            case "set":
                if (!birthdayData) {
                    let month = options.getNumber("month");
                    let day = options.getNumber("day");

                    let birthday = `${month}/${day}`;

                    try {
                        birthdayData = new Birthday({
                            UserID: interaction.user.id,
                            GuildID: guildId,
                            Birthday: birthday
                        });

                        await birthdayData.save();

                        embed
                            .setDescription(`${userMention(interaction.user.id)}, your birthday has been set to \`${birthday}\`!`)
                            .setColor(Config.colors.success as ColorResolvable)

                        return await interaction.reply({ embeds: [embed], ephemeral: true });

                    } catch (err) {

                        console.log(`[ERROR] Error setting a user's birthday! (${interaction.user.id})\n${err}`.red);

                        embed
                            .setColor(Config.colors.error as ColorResolvable)
                            .setDescription(`There was an error setting your birthday!\n\n\`${err}\``);

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                } else {
                    let guildData = await Guild.findOne({ GuildID: guildId });

                    if (!guildData.Changeable) {
                        embed
                            .setColor(Config.colors.error as ColorResolvable)
                            .setDescription(`${userMention(interaction.user.id)}, only admins can edit birthdays!\n`)

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {

                        let month = options.getNumber("month");
                        let day = options.getNumber("day");

                        let birthday = `${month}/${day}`;

                        try {
                            await birthdayData.updateOne({
                                Birthday: birthday
                            });

                            embed
                                .setDescription(`${userMention(interaction.user.id)}, your birthday has been changed to \`${birthday}\`!`)
                                .setColor(Config.colors.success as ColorResolvable)

                            return await interaction.reply({ embeds: [embed] });

                        } catch (err) {
                            console.log(`[ERROR] Error changing a user's birthday! (${interaction.user.id})\n${err}`.red)

                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`An error occured while attemptin to change your birthday!\n\n\`${err}\``)
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    }
                }
            case "view":
                const target = options.getUser("target");

                if (!target) {

                    if (!birthdayData) {
                        embed
                            .setColor(Config.colors.error as ColorResolvable)
                            .setDescription("You have not set your birthday!")
                            .setFooter({
                                text: "/birthday set",
                                iconURL: client.user.avatarURL()
                            });

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {

                        embed
                            .setColor(Config.colors.primary as ColorResolvable)
                            .setDescription(`${userMention(interaction.user.id)}, your birthday is set as \`${birthdayData.Birthday}\``);

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                } else {

                    birthdayData = await Birthday.findOne({
                        GuildID: guildId,
                        UserID: target.id
                    });

                    if (!birthdayData) {
                        embed
                            .setColor(Config.colors.error as ColorResolvable)
                            .setDescription(`${userMention(target.id)} has not set their birthday!`)
                            .setFooter({
                                text: "/birthday set",
                                iconURL: client.user.avatarURL()
                            });

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {

                        let birthday = birthdayData.Birthday;

                        embed
                            .setColor(Config.colors.primary as ColorResolvable)
                            .setDescription(`${userMention(target.id)}'s birthday is set as \`${birthday}\``);

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }
            case "list":
                const month = options.getNumber("month", false);

                let guildBirthdays = await Birthday.find({ GuildID: guildId });

                let birthdayArray: BirthdayData[] = [];

                if (!month) {

                    for (const birthdayData of guildBirthdays) {
                        birthdayArray.push({ userId: birthdayData.UserID, birthday: birthdayData.Birthday });
                    }

                    const birthdaysMapped = birthdayArray.map((data) => (
                        `${userMention(data.userId)} — \`${data.birthday}\``
                    ));

                    const birthdays = birthdaysMapped.join(`\n`);

                    embed
                        .setColor(Config.colors.primary as ColorResolvable)
                        .setDescription(birthdays)


                    return await interaction.reply({ embeds: [embed] });
                } else {

                    for (const birthdayData of guildBirthdays) {
                        if (Number(birthdayData.Birthday.split("/")[0]) === month) {
                            birthdayArray.push({ userId: birthdayData.UserID, birthday: birthdayData.Birthday });
                        }
                    }

                    const selectedMonth = getMonth(month);

                    const birthdaysMapped = birthdayArray.map((data) => (
                        `${userMention(data.userId)} — \`${data.birthday}\``
                    ));

                    if (birthdaysMapped.length > 0) {
                        const birthdays = birthdaysMapped.join(`\n`);

                        embed
                            .setColor(Config.colors.primary as ColorResolvable)
                            .setDescription(`**${selectedMonth}**\n\n${birthdays}`);
                    } else {
                        embed
                            .setColor(Config.colors.primary as ColorResolvable)
                            .setDescription(`**${selectedMonth}**\n\nNo birthdays found!`);
                    }

                    return await interaction.reply({ embeds: [embed] });
                }
        }
    }
}

module.exports = birthday;