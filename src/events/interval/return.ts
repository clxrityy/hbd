import { Client } from "discord.js";
import Birthday from "../../models/Birthday";


module.exports = (client: Client) => {

    const handleInterval = async (client: Client) => {
        let date = new Date();
        let currentDate = Date.now();
        let filter = {}
        const birthdays = Birthday.find(filter);
    
        if (date.getHours() === 12) {
            for (const birthday of await birthdays) {
                if (birthday.Birthday === currentDate) {
                    client.emit("birthday")
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
