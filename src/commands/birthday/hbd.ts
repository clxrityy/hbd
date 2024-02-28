import { ColorResolvable, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import { SlashCommand } from "../../utils/types";
import { checkIfAlreadyWished, checkIfBirthdayMember, getUserWishes } from "../../utils/bdayUtil";
import config from "../../config";
import Wish from "../../models/Wish";

const date = new Date();

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
                .setMaxValue(date.getFullYear())
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

                if (isBirthday) {
                    if (typeof isBirthday === "string") {
                        embed
                            .setColor(config.colors.error as ColorResolvable)
                            .setDescription(isBirthday)
                        
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {
                        const alreadyWished = await checkIfAlreadyWished({ guildId: guildId, targetUserId: target.id, userId: user.id, year: year });

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
                                Message: message && message
                            });

                            await wishData.save();

                            embed
                                .setColor(config.colors.success as ColorResolvable)
                                .setDescription(`✉️\n\n**Your wish to ${userMention(target.id)} has been sent!**\n*${message && message}*`)
                                .setFooter({
                                    text: `/hbd view`
                                });
                            
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                    }

                } else {
                    embed
                        .setColor(config.colors.error as ColorResolvable)
                        .setDescription("You can only send wishes to users on their birthday!")
                    
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            case "view":
                const targetUser = options.getUser("target");
                const targetYear = options.getNumber("year");

                let wishes: string = "";
                let wishCount: number = 0;

                if (!targetUser && !targetYear) {
                    let wishesArray = await getUserWishes(user.id, guildId);

                    if (!wishesArray) {
                        embed
                            .setColor(config.colors.primary as ColorResolvable)
                            .setDescription(`**Your birthday wishes**\n\n\`None\``);
                        
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    } else {

                        let wishesMapped = wishesArray.map((wish) => (
                            `${userMention(wish.userId)} — ${wish.message ? wish.message : config.messages.happyBirthdayMessage} | ${wish.year}`
                        ));

                        wishes = wishesMapped.join("\n");
                        wishCount = wishesArray.length;

                        embed
                            .setColor(config.colors.primary as ColorResolvable)
                            .setDescription(`**Your birthday wishes**\n\n${wishes}`)
                            .setFooter({
                                text: `Wishes: ${wishCount}`
                            });
                        
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                } else if (targetUser || targetYear) {

                    if (targetYear && targetUser) {
                        let wishesArray = await getUserWishes(targetUser.id, guildId, targetYear);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**${userMention(targetUser.id)}'s wishes** (${targetYear})\n\n\`None\``)
                                .setFooter({
                                    text: "/hbd wish"
                                });

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        } else {

                            let wishesMapped = wishesArray.map((wish) => (
                                `${userMention(wish.userId)} — ${wish.message ? wish.message : config.messages.happyBirthdayMessage}`
                            ));

                            wishes = wishesMapped.join("\n");

                            wishCount = wishesArray.length;

                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**${userMention(targetUser.id)}'s wishes** (${targetYear})\n\n${wishes}`)
                                .setFooter({
                                    text: `Wishes: ${wishCount}`
                                });
                            
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    } else if (targetUser) {

                        let wishesArray = await getUserWishes(targetUser.id, guildId);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**${userMention(targetUser.id)}'s wishes**\n\n\`None\``)
                                .setFooter({
                                    text: "/hbd wish"
                                });

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        } else {

                            wishCount = wishesArray.length;

                            let wishesMapped = wishesArray.map((wish) => (
                                `${userMention(wish.userId)} — ${wish.message ? wish.message : config.messages.happyBirthdayMessage} — ${wish.year}`
                            ))

                            wishes = wishesMapped.join("\n");

                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**${userMention(targetUser.id)}'s wishes** (${targetYear})\n\n${wishes}`)
                                .setFooter({
                                    text: `Wishes: ${wishCount}`
                                });
                            
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    } else {

                        let wishesArray = await getUserWishes(user.id, guildId, targetYear);

                        if (!wishesArray) {
                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**Your wishes** (${targetYear})\n\n\`None\``)
                                .setFooter({
                                    text: "/hbd wish"
                                });

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        } else {

                            let wishesMapped = wishesArray.map((wish) => (
                                `${userMention(wish.userId)} — ${wish.message ? wish.message : config.messages.happyBirthdayMessage}`
                            ));

                            wishes = wishesMapped.join("\n");
                            wishCount = wishesArray.length;

                            embed
                                .setColor(config.colors.primary as ColorResolvable)
                                .setDescription(`**Your wishes** (${targetYear})\n\n${wishes}`)
                                .setFooter({
                                    text: `Wishes: ${wishCount}`
                                });
                            
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    }
                }
        }
    }
}

module.exports = hbd;