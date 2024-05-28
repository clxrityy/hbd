import { Client } from "discord.js";
import Birthday from "../../../models/Birthday";
import { getDate } from "../../utils/getDate";


module.exports = (client: Client) => {


    const handleInterval = async (client: Client, date: Date) => {
        let filter = {};

        const birthdays = await Birthday.find(filter);

        const dateString = date.toLocaleDateString();
        const dateArray = dateString.split("/");

        const day = Number(dateArray[1]);

        const dateParsed = dateArray[0] + `/` + `${day + 1}`;

        for (const birthday of birthdays) {

            if (birthday.Birthday === dateParsed) {
                // if (date.getHours() === 0)
                //     client.emit("birthday", [birthday.UserID, birthday.GuildID]);
                // else {
                //     const timeUntilMidnight = (24 - date.getHours()) * 60 * 60 * 1000;
                //     setTimeout(() => {
                //         client.emit("birthday", [birthday.UserID, birthday.GuildID]);
                //     }, timeUntilMidnight);
                // }
                client.emit("birthday", [birthday.UserID, birthday.GuildID]);
            }
        }
    }

    return setInterval(async () => await handleInterval(client, getDate()), 1000 * 60 * 60 * 13);
    // 1000 * 60 * 60 = 1 hr
}
