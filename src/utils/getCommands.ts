import { ApplicationCommandManager, Client, GuildApplicationCommandManager } from "discord.js";
import path from "path";
import getFiles from "./getFiles";


const getApplicationCommands = async (client: Client, guildId?: string) => {
    let applicationCommands: GuildApplicationCommandManager | ApplicationCommandManager;

    if (guildId) { // if registering to a specific guild
        const guild = await client.guilds.fetch(guildId);
        applicationCommands = guild.commands;
    } else {
        applicationCommands = client.application.commands;
    }

    await applicationCommands.fetch({
        guildId: guildId
    });

    return applicationCommands;
}

const getLocalCommands = (exceptions = []) => {
    let localCommands = [];

    const commandCategories = getFiles(path.join(__dirname, "..", "commands"), true);

    for (const commandCategory of commandCategories) {
        const commandFiles = getFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile);

            if (exceptions.includes(commandObject.name)) continue;
            localCommands.push(commandObject);
        }
    }

    return localCommands;
}

export {
    getApplicationCommands,
    getLocalCommands
};