import { ChatInputCommandInteraction, Client, ColorResolvable, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommand = {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody | SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    userPermissions: Array<bigint>;
    botPermissions: Array<bigint>;
    run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;
    deleted?: boolean;
}

export type Config = {
    openai: {
        model: string;
        systemRoleContent: string;
        temperature: number;
        presence_penalty: number;
    },
    colors: {
        error: string | ColorResolvable;
        success: string | ColorResolvable;
        primary: string | ColorResolvable;
    }
}