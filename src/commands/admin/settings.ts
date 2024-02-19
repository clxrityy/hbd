import { ColorResolvable, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/types";
import Guild from "../../models/guild";
import config from "../../config";

const settings: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Your guild's AI settings")
        .setDMPermission(false)
        /*
            `/settings config`
        */
        .addSubcommand((sub) => sub
            .setName("config")
            .setDescription("Configure your settings")
            // system role content
            .addStringOption((option) => option
                .setName("role")
                .setDescription("The system role content")
                .setMinLength(10)
                .setMaxLength(500)
            )
            // temperature (0 - 1)
            .addNumberOption((option) => option
                .setName("temperature")
                .setDescription("The temperature (randomness) of the responses")
                .setMinValue(0)
                .setMaxValue(2)
            )
            // presence penalty (-2 - 2)
            .addNumberOption((option) => option
                .setName("presence_penalty")
                .setDescription("How diverse the responses are")
                .setMinValue(-2)
                .setMaxValue(2)
            )
        )
        /*
           `/settings view`
        */
        .addSubcommand((sub) => sub
            .setName("view")
            .setDescription("View your guild's settings")
        )
        .addSubcommand((sub) => sub
            .setName("reset")
            .setDescription("Reset your guild to default settings")
        ).addSubcommand((sub) => sub
            .setName("help")
            .setDescription("Information about configuring your settings")
        ).toJSON(),

    userPermissions: [PermissionsBitField.Flags.Administrator],
    botPermissions: [],
    run: async (client, interaction) => {
        const { options, guild, guildId } = interaction;

        const subCommand = options.getSubcommand(true);

        if (!["config", "view", "reset", "help"].includes(subCommand)) return;

        let guildData = await Guild.findOne({
            GuildID: guildId
        });

        if (!guildData) {
            guildData = new Guild({
                GuildID: guildId,
                Model: config.openai.model,
                SystemRoleContent: config.openai.systemRoleContent,
                Temperature: config.openai.temperature,
                PresencePenalty: config.openai.presence_penalty
            });

            await guildData.save();
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() });

        switch (subCommand) {
            case "view":
                embed
                    .setDescription(`**${guild.name}**'s settings\n\n`)
                    .setThumbnail(guild.iconURL())
                    .addFields(
                        {
                            name: "Model",
                            value: `${guildData.Model}`
                        },
                        {
                            name: "Role",
                            value: `${guildData.SystemRoleContent}`
                        },
                        {
                            name: "Temperature",
                            value: `${guildData.Temperature}`
                        },
                        {
                            name: "Presence Penalty",
                            value: `${guildData.PresencePenalty}`
                        }
                    )
                    .setColor(config.colors.primary as ColorResolvable)
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            case "reset":
                await guildData.updateOne({
                    SystemRoleContent: config.openai.systemRoleContent,
                    Model: config.openai.model,
                    Temperature: config.openai,
                    PresencePenalty: config.openai.presence_penalty
                });
                await guildData.save();

                embed
                    .setDescription(`Successfully reset **${guild.name}** back to default settings!\n \`/settings view\``)
                    .setColor(config.colors.success as ColorResolvable)

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            case "config":
                const role = options.getString("role")
                const temperature = options.getNumber("temperature");
                const presencePenalty = options.getNumber("presence_penalty");

                if (role) {
                    await guildData.updateOne({
                        SystemRoleContent: role
                    });
                }
                if (temperature) {
                    await guildData.updateOne({
                        Temperature: temperature
                    });
                }
                if (presencePenalty) {
                    await guildData.updateOne({
                        PresencePenalty: presencePenalty
                    })
                }

                await guildData.save();

                embed
                    .setDescription(`Successfully updated **${guild.name}'s** settings!\n \`/settings view\``)
                    .setColor(config.colors.success as ColorResolvable);

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            case "help":
                embed
                    .setColor(config.colors.primary as ColorResolvable)
                    .setTitle("⚙️")
                    .setDescription(`\`/settings\`\n- \`view\` — view your current settings\n- \`reset\` — reset to default settings\n- \`config\` — configure your settings\n`)
                    .addFields(
                        {
                            name: `model`,
                            value: `The desired AI model ([link](https://platform.openai.com/docs/models)).\n**Default:** \`${config.openai.model}\``,
                            inline: true,
                        },
                        {
                            name: `role`,
                            value: `Instructions for the AI's behavior ([link](https://platform.openai.com/docs/guides/text-generation/chat-completions-api)).\n**Default**: \`${config.openai.systemRoleContent}\``,
                        },
                        {
                            name: `temperature`,
                            value: `Lower values make the response more deterministic, higher makes it more random. ([link]( https://platform.openai.com/docs/guides/text-generation/how-should-i-set-the-temperature-parameter))\n**Default**: \`${config.openai.temperature}\``,
                            inline: true,
                        },
                        {
                            name: `presence_penalty`,
                            value: `Higher values increase likelihood to talk about new topics. ([link](https://platform.openai.com/docs/guides/text-generation/parameter-details))\n**Default**: \`${config.openai.presence_penalty}\``
                        }
                    );
                return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
}


module.exports = settings;