import { Client } from "discord.js";
import Birthday from "../../models/Birthday";


module.exports = (client: Client) => {

    let date = new Date();

    const handleInterval = async (client: Client) => {
        let filter = {}
        const birthdays = await Birthday.find(filter);

        const dateString = date.toLocaleDateString();
        const dateArray = dateString.split("/");
        const dateParsed = dateArray[0] + `/` + dateArray[1];

        for (const birthday of birthdays) {

            if (birthday.Birthday === dateParsed) {
                client.emit("birthday", [birthday.UserID, birthday.GuildID]);
            }
        }
    }

    return setInterval(async () => await handleInterval(client), 1000 * 60 * 60 * 24); // change to 24 hr
    // 1000 * 60 * 60 = 1 hr
}
