import { ChatInputCommandInteraction, Client, ColorResolvable, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommand = {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody | SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    userPermissions: Array<bigint>;
    botPermissions: Array<bigint>;
    run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;
    deleted?: boolean;
}

type Field = {
    name: string;
    value: string;
    inline?: boolean;
}

export interface Embed {
    title?: string;
    url?: string;
    description?: string;
    image?: string;
    thumbnail?: string;
    timestamp?: boolean | Date;
    author?: {
        name?: string;
        iconURL?: string;
        url?: string;
    };
    footer?: {
        text: string;
        iconURL?: string;
    },
    fields?: Field[];
    color?: string | ColorResolvable;
}

export type Config = {
    client: Client;
    openai?: {
        model: string;
        systemRoleContent: string;
        temperature: number;
        presence_penalty: number;
    },
    colors?: {
        error?: string | ColorResolvable;
        success?: string | ColorResolvable;
        primary?: string | ColorResolvable;
        secondary?: string | ColorResolvable;
    },
    messages: {
        happyBirthday: Embed;
    },
    commands: {
        adminCommands: string[];
        devCommands: string[];
    },
    developerIds: string[]
}