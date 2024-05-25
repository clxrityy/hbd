import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import eventHandler from "./master/handlers";
import api from "./api";

config() // Load environment variables

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ] // Specify all the intents you wish your bot to access
});

export const cooldowns = new Map<string, number>(); // Cooldowns for commands

eventHandler(client); // Register events

api(); // Start the server

client.login(process.env.BOT_TOKEN!)

export default client;