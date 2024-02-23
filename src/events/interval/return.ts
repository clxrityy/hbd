import { Client } from "discord.js";
import Birthday from "../../models/Birthday";


module.exports = (client: Client) => {

    const handleInterval = async (client: Client) => {
        let date = new Date();
        let filter = {}
        const birthdays = await Birthday.find(filter);

        const dateString = date.toLocaleDateString();
        const dateArray = dateString.split("/");
        const dateParsed = dateArray[0] + `/` + dateArray[1];

        for (const birthday of birthdays) {

            if (birthday.Birthday === dateParsed) {
                client.emit("birthday", birthday.UserID);
            } else {
                return;
            }
        }
    }

    return setInterval(async () => await handleInterval(client), 1000 * 60 * 60 * 24);
    // 1000 * 60 * 60 = 1 hr
}
