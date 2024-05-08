import { ColorResolvable, EmbedBuilder, Guild, GuildMember, SlashCommandBuilder, userMention } from "discord.js";
import { SlashCommand } from "../../misc/types";
import config from "../../config";
import GuildModel from "../../models/Guild";

const emit: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Manually emit a birthday event (developers)")
        .addUserOption((option) => option
            .setName("target")
            .setDescription("The target user")
            .setRequired(true))
        ,
    botPermissions: [],
    userPermissions: [],
    run: async (client, interaction) => {
        if (!config.developerIds.includes(interaction.user.id)) return;

        const { options, guildId, channel } = interaction;

        const target = options.getUser("target", true);

        let embed = new EmbedBuilder();
        let birthdayEmbed = new EmbedBuilder()

        let guildData = await GuildModel.findOne({ GuildID: guildId });

        if (!guildData.BirthdayRole) {
            embed.setDescription("The birthday role is not configured!").setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: "/config"
            }).setColor(config.colors.error as ColorResolvable);

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let targetGuild: Guild;
        let user: GuildMember;

        try {
            client.guilds.cache.forEach((guild) => {
                if (guild.id === guildId) {
                    targetGuild = guild;
                }
            });

            if (targetGuild.id != guildId) return;

            targetGuild.members.cache.forEach((member) => {
                if (member.id === target.id) {
                    user = member;
                }
            });

            if (!user) {
                embed.setDescription("The target user is not in the guild!").setColor(config.colors.error as ColorResolvable);

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            let birthdayRole = targetGuild.roles.cache.get(guildData.BirthdayRole);

            if (!birthdayRole) {
                embed
                    .setDescription("The birthday role is not found!")
                    .setColor(config.colors.error as ColorResolvable)
                    .setFooter({
                        text: "/config roles",
                        iconURL: client.user.displayAvatarURL()
                    })

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            birthdayEmbed.setTitle(config.messages.happyBirthdayAnnouncement.title)
                .setDescription(`Happy birthday to ${userMention(target.id)}!`)
                .setColor(config.colors.primary as ColorResolvable)
                .setFooter(config.messages.happyBirthdayAnnouncement.footer);

            try {
                await user.roles.add(birthdayRole).then(() => {
                    embed.setDescription(`Added the birthday role to ${userMention(target.id)}`).setColor(config.colors.success as ColorResolvable);
                });

                let announceEmbed = new EmbedBuilder();

                let targetChannel = targetGuild.channels.cache.get(guildData.AnnouncementChannel);

                

                if (!guildData.AnnouncementChannel || !targetChannel) {
                    announceEmbed.setDescription("The announcement channel is not configured, sending the announcement in this channel").setColor(config.colors.warning as ColorResolvable);

                    await channel.send({ embeds: [birthdayEmbed] });

                    return await interaction.reply({ embeds: [embed, announceEmbed], ephemeral: true });
                };

                let message = guildData.AnnouncementMessage;

                if (!message) {
                    await channel.send({ embeds: [birthdayEmbed] });
                    console.log(`[INFO] Manually sent birthday announcement to ${channel.guild.name}`.white.bgBlack);
                }

                message = message.replace("{{user}}", `${userMention(target.id)}`);
                await channel.send({ content: message });
                console.log(`[INFO] Manually sent birthday announcement to ${channel.guild.name}`.white.bgBlack);

            } catch (err) {

                embed.setColor(config.colors.error as ColorResolvable)
                    .setDescription(`**ERROR**\n\`\`\`js\n${err}\`\`\``);
                
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

        } catch (err) {
            embed.setColor(config.colors.error as ColorResolvable)
                .setDescription(`**ERROR**\n\`\`\`js\n${err}\`\`\``);
            
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

    }
}

module.exports = emit;