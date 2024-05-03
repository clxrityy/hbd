import "colors";
import { Client } from "discord.js";
import { getDate } from "../../utils/getDate";

module.exports = (client: Client) => {

    client.emit("interval");
}