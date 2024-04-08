import { Client } from "discord.js";

module.exports = (client: Client) => {
    const interval = (hours: number) => setInterval(() => {
        const date = new Date();
        const currentHour = date.getHours();

        if (currentHour === hours) {
            client.emit("interval");
        }
    }, 60 * 60 * 1000); // Check every hour

    return interval(0); // Start the interval at 12 AM
}