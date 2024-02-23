import { Config } from "./utils/types";
import client from ".";

const config: Config = {
    client: client,
    openai: {
        model: "gpt-4-turbo-preview",
        systemRoleContent: "Respond to the given prompt in a useful way.",
        temperature: 0.89,
        presence_penalty: 0,
    },
    colors: {
        error: "#e35f58",
        success: "#55cf6f",
        primary: "#71b8e1"
    },
    messages: {
        happyBirthday: {
            title: "hbd! 🎉",
            color: "#71b8e1",
            footer: {
                text: "/birthday set",
                iconURL: client.user.avatarURL()
            }
        },
    },
}

export default config;