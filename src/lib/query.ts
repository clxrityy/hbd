import { QueryPrompt } from "../misc/types";
import openai from "./openai";
import config from "../config";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function query(prompt: QueryPrompt) {
    
    const currentDate = prompt.currentDate instanceof Date ? prompt.currentDate : new Date(prompt.currentDate);
    const dateObj = new Date(currentDate);
    const month = dateObj.getMonth();
    const day = dateObj.getDay();
    const year = dateObj.getFullYear();
    const date = `${month + 1}/${day}/${year}`;

    const signObj = prompt.sign;
    const sign = signObj.name;
    const user = prompt.userData.username;

    const queryPrompt = `USER: ${user}\nSIGN: ${sign}\nCURRENT DATE: ${date}\nBIRTHDAY: ${prompt.birthday}`;

    try {
        const res = await openai.chat.completions.create({
            model: config.openai.model,
            messages: [
                {
                    role: "system",
                    content: config.openai.systemRoleContent
                },
                {
                    role: "user",
                    content: queryPrompt
                },
            ],
            temperature: config.openai.temperature,
            presence_penalty: config.openai.presence_penalty,
            user: prompt.userData.id,
            n: config.openai.n
        })
            .then((res) => res.choices[0].message.content)
            .catch((err) => `**An error occurred:**\n\`\`\`${err}\`\`\``);
        
        await sleep(200);
    
        return res;
    } catch (e) {
        return `An error occurred: \`${e}\``;
    }
}