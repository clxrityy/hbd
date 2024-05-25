import "colors";
import { Client, ColorResolvable, CommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import config from "../../../config";
import Guild from "../../../models/Guild";
import { SlashCommand } from "../../misc/types";
import { getLocalCommands } from "../../utils/getCommands";

module.exports = async (client: Client, interaction: CommandInteraction) => {

    if (!interaction.isChatInputCommand()) return;

    const { guildId, channelId, guild } = interaction;

    let guildData = await Guild.findOne({ GuildID: guildId });

    const localCommands = getLocalCommands();
    const commandObject: SlashCommand = localCommands.find((cmd: SlashCommand) => cmd.data.name === interaction.commandName);

    if (!commandObject) return;

    const createEmbed = (color: string | ColorResolvable, description: string) => new EmbedBuilder()
        .setColor(color as ColorResolvable)
        .setDescription(description);

    for (const permission of commandObject.userPermissions || []) {
        if (!interaction.memberPermissions.has(permission)) {
            const embed = createEmbed(config.colors.error as ColorResolvable, "You do not have permission to execute this command!");

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    const bot = interaction.guild.members.me;

    for (const permission of commandObject.botPermissions || []) {
        if (!bot.permissions.has(permission)) {
            const embed = createEmbed(config.colors.error as ColorResolvable, "I don't have permission to execute this command!");

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    // let whitelistData = await Whitelist.find({ GuildID: guildId });
    // let whitelistDataRolesArray = whitelistData.map((data) => (
    //     data.RoleID
    // ));
    // let whitelistDataCommandNamesArray = whitelistData.map((data) => (
    //     data.CommandName
    // ));
    // guild admin commands
    if (guildData) {
        if (config.commands.adminCommands.includes(commandObject.data.name) && guildData.AdminRole) {
            guild.roles.cache.forEach((role) => {
                if (role.id === guildData.AdminRole) {
                    role.members.forEach(async (member) => {
                        if (member === interaction.member) {
                            await commandObject.run(client, interaction);
                        }
                    })
                }
            });
    
        } else if (config.commands.adminCommands.includes(commandObject.data.name) && !guildData.AdminRole) {
    
            if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                let embed = createEmbed(config.colors.error as ColorResolvable, "You need **administrator** permissions to run this command!");
    
                try {
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } catch (err) {
                    console.log(`[ERROR] An error occured while a non admin user attempted to use an admin command!\n${err}`.red);
    
                    embed = createEmbed(config.colors.error as ColorResolvable, `An error occured!\n\n\`${err}\``);
    
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } else {
                await commandObject.run(client, interaction);
            }
        } else {
    
            // developer commands
            if (config.commands.devCommands.includes(commandObject.data.name)) {
                if (!config.developerIds.includes(interaction.user.id)) {
    
                    let embed = createEmbed(config.colors.error as ColorResolvable, "This command is only available to the bot's developers!\nIf there is an error/issue, please report it [**here**](https://github.com/clxrityy/hbd/issues/new).");
    
                    try {
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                    } catch (err) {
                        console.log(`[ERROR] An error occured after a user attempted to use a developer command!\n${err}`.red);
                        embed = createEmbed(config.colors.error as ColorResolvable, `An error occured!\n\n\`${err}\``);
    
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }
                
            } else {
                try {
                    if (!guildData.CommandsChannel) {
                        await commandObject.run(client, interaction)
                    } else {
                        if (guildData.CommandsChannel.includes(channelId)) {
                            await commandObject.run(client, interaction);
                        } else {
                            const embed = createEmbed(config.colors.error as ColorResolvable, `You tried to execute a command, but my commands can only be executed in <#${guildData.CommandsChannel}>`);
    
                            (await interaction.user.createDM()).send({ embeds: [embed] });
                        }
                    }
    
                } catch (err) {
                    console.log(`[ERROR] An error occured while validating commands!\n ${err}`.red);
                    console.error(err);
                }
            }
    
        }
    } else {

        try {
            await commandObject.run(client, interaction);
        } catch (err) {
            console.log(`[ERROR] An error occured while validating commands!\n ${err}`.red);
            console.error(err);
        }
    }

}