import "colors";
import { Client } from "discord.js";
import commandCompare from "../../utils/commandCompare";
import { getApplicationCommands, getLocalCommands } from "../../utils/getCommands";

module.exports = async (client: Client) => {
    try {

        const [localCommands, applicationCommands] = await Promise.all([
            getLocalCommands(),
            getApplicationCommands(client)
        ]);

        for (const localCommand of localCommands) {
            const { data, deleted } = localCommand;
            const { name: commandName, description: commandDescription, options: commandOptions } = data;

            const existingCommand = applicationCommands.cache.find((cmd) => cmd.name === commandName);

            if (deleted) {
                if (existingCommand) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`[COMMAND] Application command ${commandName} has been deleted!`.grey);
                } else {
                    console.log(`[COMMAND] Application command ${commandName} has been skipped!`.grey);
                }
            } else if (existingCommand) {
                if (commandCompare(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        name: commandName, description: commandDescription, options: commandOptions
                    });
                    console.log(`[COMMAND] Application command ${commandName} has been edited!`.grey);
                }
            } else {
                await applicationCommands.create({
                    name: commandName, description: commandDescription, options: commandOptions
                });
                console.log(`[COMMAND] Application command ${commandName} has been registered!`.grey);
            }
        }

    } catch (err) {
        console.log(`[ERROR] There was an error inside the command registry!\n ${err}`.red);
    }
}