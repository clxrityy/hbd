import client from ".";
import { Config } from "./misc/types";

const config: Config = {
    client: client,
    colors: {
        error: "#e35f58",
        success: "#55cf6f",
        primary: "#ffffff",
    },
    messages: {
        happyBirthdayAnnouncement: {
            title: "hbd! 🎉",
            color: "#71b8e1",
            footer: {
                text: "/birthday set",
                iconURL: client.user.avatarURL()
            }
        },
        happyBirthdayMessage: "wished you a happy birthday!"
    },
    commands: {
        adminCommands: ["config", "edit"],
        devCommands: ["bot"]
    },
    developerIds: ['244304391815823361', '706976863096143936'],
    options: {
        startYear: 2024
    },
    openai: {
        model: "gpt-3.5-turbo",
        systemRoleContent: "Your job is to provide a horoscope for a user based on their birthday/zodiac sign and the current date. Tell them what they can expect for the day in a spiritual sense. (If possible, provide evidence based on how the stars are aligned). Keep your response to below 500 characters. Do not make up any information. If needed, you can reference this site: https://www.horoscope.com/us/index.aspx",
        temperature: 0.35,
        presence_penalty: 1,
        n: 1
    }
}

export default config;