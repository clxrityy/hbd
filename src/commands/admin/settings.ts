import { ColorResolvable, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/types";
import Guild from "../../models/Guild";
import config from "../../config";

const settings: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Your guild's birthday settings")
        .setDMPermission(false)
        // channels
        .addSubcommandGroup((group) => group
            .setName("channels")
            .setDescription("Channel settings")
            .addSubcommand((sub) => sub
                .setName("announcement")
                .setDescription("The channel the bot announces birthdays in")
                .addChannelOption((option) => option
                    .setName("channel")
                    .setRequired(true)
                )
            )
            .addSubcommand((sub) => sub
                .setName("commands")
                .setDescription("The channel for birthday commands")
                .addChannelOption((option) =>
                    option.setName("channel")
                        .setRequired(true)
                )
                
            )
    )
        // roles
        .addSubcommandGroup((group) => group
            .setName("roles")
            .setDescription("Role settings")
            .addSubcommand((sub) => sub
                .setName("birthday")
                .setDescription("The role users get on their birthday")
                .addRoleOption((option) =>
                    option.setName("role")
                    .setRequired(true)
            )
        )
            .addSubcommand((sub) => sub
                .setName("admin")
                .setDescription("The role that can manage settings & birthdays")
                .addRoleOption((option) => 
                    option.setName("role")
                    .setRequired(true)
                )
        )
    )
        .addSubcommand((sub) => sub
            .setName("view")
            .setDescription("View your guild's settings")
    ),
    userPermissions: [PermissionsBitField.Flags.Administrator],
    botPermissions: [],
    run: async (client, interaction) => {
        const { guild, guildId, options } = interaction;

        const subCommandGroup = options.getSubcommandGroup();

        let guildData = await Guild.findOne({ GuildID: guildId });

        if (!guildData) {
            guildData = new Guild({
                GuildID: guildId
            });
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL()
            })
            .setTitle("⚙️")
        
        if (!subCommandGroup) {

            const subCommand = options.getSubcommand();

            switch (subCommand) {
                case "view":
                    embed.setDescription(`**${guild.name}'s settings**: \n\n`)
                        .addFields(
                            {
                                name: "channels",
                                value: `**ANNOUNCEMENT**: <#${guildData.Channels.Announcement}>\n**COMMANDS**: <#${guildData.Channels.Commands}`
                            },
                            {
                                name: "roles",
                                value: `**BIRTHDAY**: <@&${guildData.Roles.Birthday}>\n**ADMIN**: <@&${guildData.Roles.Admin}>`
                            }
                    )
                            .setColor(config.colors.primary as ColorResolvable)
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    },
}


module.exports = settings;