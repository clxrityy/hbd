import { Client } from "discord.js";
import path from "path";
import getFiles from "../utils/getFiles";

const eventHandler = (client: Client) => {
    const eventFolders = getFiles(path.join(__dirname, "..", "events"), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getFiles(eventFolder);

        let eventName: string;

        eventName = eventFolder.replace(/\\/g, '/').split("/").pop();

        eventName === "validations" ? (eventName = "interactionCreate") : eventName;

        client.on(eventName, async (args) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, args);
            }
        })
    }
}

export default eventHandler;