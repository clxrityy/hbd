import { Config } from "./utils/types";

const config: Config = {
    openai: {
        model: "gpt-4-turbo-preview",
        systemRoleContent: "Respond to the given prompt in a useful way.",
        temperature: 0.89,
        presence_penalty: 0,
    },
    colors: {
        error: "#e35f58",
        success: "#55cf6f",
        primary: "#55a8cf"
    }
}

export default config;