import client from ".";
import { Config } from "./misc/types";

const config: Config = {
    client: client,
    // openai: {
    //     model: "gpt-4-turbo-preview",
    //     systemRoleContent: "Respond to the given prompt in a useful way.",
    //     temperature: 0.89,
    //     presence_penalty: 0,
    // },
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
    }
}

export default config;