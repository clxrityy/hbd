import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import eventHandler from "./handlers";

config() // Load environment variables

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ] // Specify all the intents you wish your bot to access
});

eventHandler(client) // Register events

client.login(process.env.BOT_TOKEN!); // Login to the bot