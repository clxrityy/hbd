import { APIRole, ColorResolvable, EmbedBuilder, PermissionsBitField, Role, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../../utils/types";
import Guild from "../../models/Guild";
import Config from "../../config";
import "colors";

const config: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Your guild's configurations")
        // view
        .addSubcommand((sub) => sub
            .setName("view")
            .setDescription("View your guild's configurations")
        )
        // channels
        .addSubcommandGroup((group) => group
            .setName("channels")
            .setDescription("Channel settings")
            // announcements
            .addSubcommand((sub) => sub
                .setName("announcements")
                .setDescription("The channel to announce birthdays")
                .addChannelOption((option) => option
                    .setName("announcement_channel")
                    .setDescription("Mention the channel")
                    .setRequired(true)
                )
            )
            // commands
            .addSubcommand((sub) => sub
                .setName("commands")
                .setDescription("The channel for commands")
                .addChannelOption((option) => option
                    .setName("command_channel")
                    .setDescription("Mention the channel")
                    .setRequired(true)
                )
            )
            .addSubcommand((sub) => sub
                .setName("reset")
                .setDescription("Reset channel settings")
            )
        )
        // roles
        .addSubcommandGroup((group) => group
            .setName("roles")
            .setDescription("Role settings")
            // birthday
            .addSubcommand((sub) => sub
                .setName("birthday")
                .setDescription("The role users obtain on their birthday")
                .addRoleOption((option) => option
                    .setName("birthday_role")
                    .setDescription("Mention the role")
                    .setRequired(true)
                )
            )
            // admin
            .addSubcommand((sub) => sub
                .setName("admin")
                .setDescription("The role with admin permissions")
                .addRoleOption((option) => option
                    .setName("admin_role")
                    .setDescription("Mention the role")
                    .setRequired(true)
                )
            )
            .addSubcommand((sub) => sub
                .setName("reset")
                .setDescription("Reset role settings")
            )
    )
        // messages
        .addSubcommandGroup((group) => group
            .setName("messages")
            .setDescription("Message settings")
            // birthday announcement
            .addSubcommand((sub) => sub
                .setName("announcement")
                .setDescription("The birthday announcement message")
                .addStringOption((option) => option
                    .setName("announcement_message")
                    .setDescription("Use {{user}} to indicate the birthday user")
                    .setRequired(true)
            )
        )
    )
        // general
        .addSubcommandGroup((group) => group
            .setName("general")
            .setDescription("General true/false guild settings")
            .addSubcommand((sub) => sub
                // changeable
                .setName("changeable")
                .setDescription("Should all users be able to change their birthday?")
                .addBooleanOption((option) => option
                    .setName("yes")
                    .setDescription("If false, only admins can edit user birthdays")
                    .setRequired(true)
                )
            )
        )
        .toJSON(),
    botPermissions: [],
    userPermissions: [],
    run: async (client, interaction) => {

        const { guild, guildId, options } = interaction;

        const subCommandGroup = options.getSubcommandGroup();

        let guildData = await Guild.findOne({
            GuildID: guildId
        });

        if (!guildData) {
            guildData = new Guild({
                GuildID: guildId
            });

            await guildData.save();
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL(),
            })
            .setTitle("⚙️");

        if (!subCommandGroup) {

            const subCommand = options.getSubcommand();
            // view
            if (subCommand === "view") {
                embed.setDescription(`**${guild.name}'s settings**: \n\n`)
                    .addFields(
                        {
                            name: "channels",
                            value: `\`announcements\` — <#${guildData.AnnouncementChannel}>\n\`commands\` — <#${guildData.CommandsChannel}>`
                        },
                        {
                            name: "roles",
                            value: `\`birthday\` — <@&${guildData.BirthdayRole}>\n\`admin\` — <@&${guildData.AdminRole}>`
                        },
                        {
                            name: "messages",
                            value: `\`announcement_message\` — *${guildData.AnnouncementMessage}*`
                        },
                        {
                            name: "general",
                            value: `\`changeable\` — **${String(guildData.Changeable)}**`
                        },
                    ).setColor(Config.colors.primary as ColorResolvable);

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        const subCommand = options.getSubcommand(true);
        // sub command groups
        switch (subCommandGroup) {
            // channels
            case "channels":

                // channel sub commands

                let channel: TextChannel;

                switch (subCommand) {
                    // anouncement channel
                    case "announcements":
                        channel = options.getChannel("announcement_channel");

                        try {
                            await guildData.updateOne({
                                AnnouncementChannel: channel.id
                            });

                            embed
                                .setDescription(`Successfully updated configurations!\n\n**Announcement channel**: <#${channel.id}>`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                })
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                });

                            return await interaction.reply({ embeds: [embed] });

                        } catch (err) {
                            console.log(`${err}`.red)
                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error configuring the announcement channel!**\n\n\`${err}\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                    // commands channel
                    case "commands":
                        channel = options.getChannel("command_channel");

                        try {

                            await guildData.updateOne({
                                CommandsChannel: channel.id
                            });

                            embed
                                .setDescription(`Successfully updated configurations!\n\n**Command channel**: <#${channel.id}>`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                })
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                });

                            return await interaction.reply({ embeds: [embed] });

                        } catch (err) {
                            console.log(`${err}`.red)
                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error configuring the command channel!**\n\n\`${err}\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    // reset
                    case "reset":

                        try {
                            await guildData.updateOne({
                                AnnouncementChannel: undefined,
                                CommandsChannel: undefined,
                            });

                            embed
                                .setDescription(`Successfully reset channel configurations!`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                })
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                });

                            return await interaction.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(`${err}`.red)
                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error resetting channel settings!**\n\n\`${err}\``);
                        }
                    default:
                        break;
                }

            // roles
            case "roles":

                let role: NonNullable<Role | APIRole>;

                // roles sub commands
                switch (subCommand) {

                    case "birthday":
                        role = options.getRole("birthday_role");

                        try {
                            await guildData.updateOne({
                                BirthdayRole: role.id
                            });

                            embed
                                .setDescription(`Successfully updated configurations!\n\n**Birthday role**: <@&${role.id}>`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                })
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                });

                            return await interaction.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(`${err}`.red)
                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error configuring the birthday role!**\n\n\`${err}\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                    case "admin":

                        role = options.getRole("admin_role");

                        try {
                            await guildData.updateOne({
                                AdminRole: role.id
                            });

                            embed
                                .setDescription(`Successfully updated configurations!\n\n**Admin role**: <@&${role.id}>`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                })
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                });

                            return await interaction.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(`${err}`.red)
                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error configuring the admin role!**\n\n\`${err}\``);

                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    // reset
                    case "reset":
                        try {
                            await guildData.updateOne({
                                AdminRole: undefined,
                                BirthdayRole: undefined,
                            });

                            embed
                                .setDescription(`Successfully reset role configurations!`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                });

                            return await interaction.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(`${err}`.red)
                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error resetting role settings!**\n\n\`${err}\``);
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    default:
                        break;
                }
            // general guild settings
            case "general":

                // sub commands
                switch (subCommand) {
                    case "changeable":

                        const changeable = options.getBoolean("yes", true);

                        if (changeable) {
                            try {
                                await guildData.updateOne({
                                    Changeable: true
                                });

                                embed 
                                    .setColor(Config.colors.success as ColorResolvable)
                                    .setDescription(`Successfully set the guild's \`changeable\` settings to **true**!`)
                                    .setFooter({
                                        text: "/config view",
                                        iconURL: client.user.avatarURL()
                                    })
                                    .setAuthor({
                                        name: interaction.user.displayName,
                                        iconURL: interaction.user.avatarURL()
                                    });
                                
                                return await interaction.reply({ embeds: [embed] });

                            } catch (err) {
                                console.log(`[ERROR] Error setting guild (${guildId}) changeable settings!\n${err}`.red);

                                embed
                                    .setColor(Config.colors.error as ColorResolvable)
                                    .setDescription(`**Error setting guild changeable settings!**\n\n\`${err}\``);
                                return await interaction.reply({ embeds: [embed], ephemeral: true });
                            }
                        } else {

                            try {
                                await guildData.updateOne({
                                    Changeable: false,
                                });
                                embed 
                                    .setColor(Config.colors.success as ColorResolvable)
                                    .setDescription(`Successfully set the guild's \`changeable\` settings to **false**!`)
                                    .setFooter({
                                        text: "/config view",
                                        iconURL: client.user.avatarURL()
                                    })
                                    .setAuthor({
                                        name: interaction.user.displayName,
                                        iconURL: interaction.user.avatarURL()
                                    });
                                
                                return await interaction.reply({ embeds: [embed] });

                            } catch (err) {
                                console.log(`[ERROR] Error setting guild (${guildId}) changeable settings!\n${err}`.red);

                                embed
                                    .setColor(Config.colors.error as ColorResolvable)
                                    .setDescription(`**Error setting guild changeable settings!**\n\n\`${err}\``);
                                return await interaction.reply({ embeds: [embed], ephemeral: true });
                            }
                        }
                }
            case "messages":
                switch (subCommand) {

                    case "announcement":
                        const announcementMsg = options.getString("announcement_message", true);

                        try {
                            await guildData.updateOne({
                                AnnouncementMessage: announcementMsg
                            });

                            const announcementMsgParsed = announcementMsg.replace("{{user}}", "`{user}`")

                            embed
                                .setDescription(`Successfully updated the announcement message!\n\n*${announcementMsgParsed}*`)
                                .setColor(Config.colors.success as ColorResolvable)
                                .setFooter({
                                    text: "/config view",
                                    iconURL: client.user.avatarURL()
                                })
                                .setAuthor({
                                    name: interaction.user.displayName,
                                    iconURL: interaction.user.avatarURL()
                                });
                            
                            return await interaction.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(`[ERROR] Error configuring announcement message!\n\n${err}`.red);

                            embed
                                .setColor(Config.colors.error as ColorResolvable)
                                .setDescription(`**Error configuring the announcement message!**\n\n\`${err}\``);
                            
                            return await interaction.reply({ embeds: [embed] });
                        }
                }
        }
    },
}

module.exports = config;