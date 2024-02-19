import { ChatInputCommandInteraction, Client, ColorResolvable, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommand = {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
    userPermissions: Array<bigint>;
    botPermissions: Array<bigint>;
    run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;
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