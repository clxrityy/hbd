import "colors";
import { Client } from "discord.js";

module.exports = (client: Client) => {
    console.log(`[INFO] ${client.user.username} is online!`.bgCyan);
}