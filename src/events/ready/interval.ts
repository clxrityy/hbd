import "colors";
import { Client } from "discord.js";

module.exports = (client: Client) => {

    client.emit("interval");
}