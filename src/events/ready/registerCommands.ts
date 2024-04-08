import "colors";
import { Client } from "discord.js";
import commandCompare from "../../utils/commandCompare";
import { getApplicationCommands, getLocalCommands } from "../../utils/getCommands";


module.exports = async (client: Client) => {

    
    const [localCommands, applicationCommands] = await Promise.all([
        getLocalCommands(),
        getApplicationCommands(client),
    ]);


    for (const localCommand of localCommands) {
        const { data, deleted } = localCommand;
        const { name: commandName, description: commandDescription, options: commandOptions } = data;

        const existingCommand = applicationCommands.cache.find((cmd) => cmd.name === commandName as string);

        if (deleted) {
            if (existingCommand) {
                try {
                    await applicationCommands.delete(existingCommand.id)
                    console.log(`[COMMAND] Application command ${commandName} has been deleted!`.grey);
                } catch (err) {
                    console.log(`[ERROR] Error deleting command!\n${err}`.red);
                }
                
            } else {
                console.log(`[COMMAND] Application command ${commandName as string} has been skipped!`.grey);
            }
        } else if (existingCommand) {
            if (commandCompare(existingCommand, localCommand)) {
                try {
                    await applicationCommands.edit(existingCommand.id, {
                        name: commandName as string, description: commandDescription as string, options: commandOptions as any
                    })
                    console.log(`[COMMAND] Application command ${commandName} has been edited!`.grey);
                } catch (err) {
                    console.log(`[ERROR] Error editing command!\n${err}`.red)
                }
                
            }
        } else {
            try {
                await applicationCommands.create({
                    name: commandName as string, description: commandDescription as string, options: commandOptions as any
                })
                console.log(`[COMMAND] Application command ${commandName} has been registered!`.grey);
            } catch (err) {
                console.log(`[ERROR] Error creating command!\n${err}`.red);
            }
        
        }
    }
}