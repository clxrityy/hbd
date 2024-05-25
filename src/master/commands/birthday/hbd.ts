import { ColorResolvable, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import Wish from "../../../models/Wish";
import config from "../../config";
import { checkIfAlreadyWished, checkIfBirthdayMember, getUserWishes } from "../../misc/bdayUtil";
import { SlashCommand } from "../../misc/types";

const dateNow = new Date();

const hbd: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("hbd")
        .setDescription("Birthday wishes!")
        .addSubcommand((sub) => sub
            .setName("wish")
            .setDescription("Wish someone a happy birthday (you can only send one wish!)")
            .addUserOption((option) => option
                .setName("user")
                .setDescription("The birthday user")
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName("birthday_message")
                .setDescription("Your short message")
                .setRequired(false)
                .setMaxLength(100)
            )
        )
        .addSubcommand((sub) => sub
            .setName("view")
            .setDescription("View birthday wishes")
            .addUserOption((option) => option
                .setName("target")
                .setDescription("The target user")
                .setRequired(false)
            )
            .addNumberOption((option) => option
                .setName("year")
                .setDescription("View wishes from a specific year")
                .setRequired(false)
                .setMinValue(config.options.startYear)
                .setMaxValue(dateNow.getFullYear())
            )
        ).toJSON()
    ,
    botPermissions: [],
    userPermissions: [],
    run: async (client, interaction) => {
        const { user, guildId, options } = interaction;

        const subCommand = options.getSubcommand(true);

        if (!subCommand) return;

        let embed = new EmbedBuilder();
        let date = new Date();
        let year = date.getFullYear();

        switch (subCommand) {
            case "wish":
                const target = options.getUser("user", true);

                const isBirthday = await checkIfBirthdayMember(target.id, guildId);

                if (target.id === user.id) {

                    embed
                        .setColor(config.colors.error as ColorResolvable)
                        .setDescription("You can't wish yourself a happy birthday!")

                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (isBirthday) {

                    if (typeof isBirthday === "string") {
                        embed.setColor(config.colors.error as ColorResolvable)
                            .setDescription(isBirthday)

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {

                        const alreadyWished = await checkIfAlreadyWished({
                            guildId: guildId,
                            targetUserId: target.id,
                            userId: user.id,
                            year: year
                        });

                        if (alreadyWished) {
                            embed
                                .setColor(config.colors.error as ColorResolvable)
                                .setDescription(`You've already sent a wish to ${userMention(target.id)}!`)

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        } else {
                            const message = options.getString("birthday_message", false);

                            let wishData = new Wish({
                                GuildID: guildId,
                                TargetUserID: target.id,
                                UserID: user.id,
                                Year: year,
                                Message: message.length > 0 ? message : config.messages.happyBirthdayMessage
                            });

                            await wishData.save();

                            embed
                                .setColor(config.colors.success as ColorResolvable)
                                .setDescription(`You've successfully wished ${userMention(target.id)} a happy birthday!`)

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    }
                } else {
                    embed
                        .setColor(config.colors.error as ColorResolvable)
                        .setDescription("You can only send wishes to users on their birthday!")

                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                };
            case "view":
                const targetUser = options.getUser("target", false);
                const targetYear = options.getNumber("year", false);

                if (!targetUser && !targetYear) {

                    try {
                        const wishesArray = await getUserWishes(user.id, guildId);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.error as ColorResolvable)
                                .setDescription(`**Your birthday wishes**:\n\n\`None\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        } else {
                            const wishesMapped = wishesArray!.map((wish, index) =>
                                `- ${String(index + 1)}: ${userMention(wish.UserID)} — ${wish.Message ? wish.Message : config.messages.happyBirthdayMessage} | **${wish.Year ? wish.Year : year}**`
                            );

                            let wishes = wishesMapped.join("\n");
                            let wishCount = wishesArray.length;

                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**Your birthday wishes**:\n\n${wishes}`)
                                .setFooter({
                                    text: `Total wishes: ${wishCount > 0 ? wishCount : "None"}`
                                });

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                    } catch (error) {
                        console.error(error);
                        return await interaction.reply({ content: "An error occurred while fetching your birthday wishes!", ephemeral: true })
                    }

                } else if (targetUser || targetYear) {

                    if (targetUser && targetYear) {
                        let wishesArray = await getUserWishes(targetUser.id, guildId, targetYear);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.error as ColorResolvable)
                                .setDescription(`**${userMention(targetUser.id)}'s birthday wishes**:\n\n\`None\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                        let wishesMapped = wishesArray.map((wish, index) => {
                            return `- ${index + 1}: ${userMention(wish.UserID) ? userMention(wish.UserID) : user.username} — ${wish.Message ? wish.Message : config.messages.happyBirthdayMessage} | **${wish.Year}**`;
                        });

                        let wishes = wishesMapped.join("\n");
                        let wishCount = wishesArray.length;

                        embed
                            .setColor(config.colors.primary as ColorResolvable)
                            .setDescription(`**${userMention(targetUser.id)}'s birthday wishes**:\n\n${wishes}`)
                            .setFooter({
                                text: `Total wishes: ${wishCount > 0 ? wishCount : "None"}`
                            });

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else if (targetUser && !targetYear) {

                        let wishesArray = await getUserWishes(targetUser.id, guildId);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.error as ColorResolvable)
                                .setDescription(`**${userMention(targetUser.id)}'s birthday wishes**:\n\n\`None\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                        let wishesMapped = wishesArray.map((wish, index) => {
                            return `- ${index + 1}: ${userMention(wish.UserID)} — ${wish.Message ? wish.Message : config.messages.happyBirthdayMessage} ${wish.Year ? wish.Year : year}`;
                        });

                        console.log(wishesArray)

                        let wishes = wishesMapped.join("\n");
                        let wishCount = wishesArray.length;

                        embed
                            .setColor(config.colors.primary as ColorResolvable)
                            .setDescription(`**${userMention(targetUser.id)}'s birthday wishes**:\n\n${wishes}`)
                            .setFooter({
                                text: `Total wishes: ${wishCount > 0 ? wishCount : "None"}`
                            });

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {
                        let wishesArray = await getUserWishes(user.id, guildId, targetYear);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.error as ColorResolvable)
                                .setDescription(`**Your birthday wishes for ${targetYear}**:\n\n\`None\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                        let wishesMapped = wishesArray.map((wish, index) => {
                            return `- ${index + 1}: ${userMention(wish.UserID)} — ${wish.Message ? wish.Message : config.messages.happyBirthdayMessage} | **${wish.Year}**`;
                        });

                        let wishes = wishesMapped.join("\n");
                        let wishCount = wishesArray.length;

                        embed
                            .setColor(config.colors.primary as ColorResolvable)
                            .setDescription(`**Your birthday wishes for ${targetYear}**:\n\n${wishes}}`)
                            .setFooter({
                                text: `Total wishes: ${wishCount > 0 ? wishCount : "None"}`
                            });

                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }
        }
    }
}

module.exports = hbd;