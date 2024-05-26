import client from "..";
import { Config } from "./misc/types";

const config: Config = {
    client: client,
    colors: {
        error: "#e35f58",
        warning: "#f7b02d",
        success: "#55cf6f",
        primary: "#ffffff",
    },
    messages: {
        happyBirthdayAnnouncement: {
            title: "hbd! 🎉",
            color: "#71b8e1",
            footer: {
                text: "/birthday set",
                iconURL: ""
            }
        },
        happyBirthdayMessage: "wished you a happy birthday!"
    },
    commands: {
        adminCommands: ["config", "edit", "embed"],
        devCommands: ["bot", "emit"]
    },
    developerIds: ['244304391815823361', '706976863096143936'],
    options: {
        startYear: 2024
    },
    openai: {
        model: "gpt-3.5-turbo",
        systemRoleContent: "Please provide a horoscope for a user based on their birthday/zodiac sign and the current date. Tell them what they can expect for the day in a spiritual sense. (If possible, provide evidence based on how the stars are aligned). Keep your response to below 500 characters. Do not make up any information that doesn't make sense. If needed, you can reference this site: https://www.horoscope.com/us/index.aspx",
        temperature: 0.35,
        presence_penalty: 1,
        n: 1,
        imageModel: "dall-e-2",
        defaultImagePrompt: ""
    },
    api: {
        endpoint: "https://discord.com/api/v10",
        redirect_uri: "http://localhost:3001/api/auth/discord/redirect"
    }
}

export default config;