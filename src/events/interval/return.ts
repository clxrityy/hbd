import { Client } from "discord.js";
import Birthday from "../../models/Birthday";


module.exports = (client: Client) => {

    const handleInterval = async (client: Client) => {
        let date = new Date();
        let filter = {}
        const birthdays = Birthday.find(filter);

        const dateString = date.toLocaleDateString();
        const dateArray = dateString.split("/");
        const dateParsed = dateArray[0] + `/` + dateArray[1];
    
        if (date.getHours() === 12) {
            for (const birthday of await birthdays) {
                if (birthday.Birthday === dateParsed) {
                    client.emit("birthday", birthday.UserID);
                } else {
                    return;
                }
            } 
        } else {
            return;
        }
    }

    return setInterval(() => handleInterval(client), 1000 * 60 * 60);
}
