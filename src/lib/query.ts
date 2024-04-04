import { QueryPrompt } from "../misc/types";
import openai from "./openai";

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
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Your job is to provide a horoscope for a user based on their birthday/zodiac sign and current date. Tell them what they can expect for the day in a spiritual sense. (If possible, provide evidence based on how the stars are aligned). Keep your response to below 500 characters."
                },
                {
                    role: "user",
                    content: queryPrompt
                },
            ],
            temperature: 0.75,
        })
            .then((res) => res.choices[0].message.content)
            .catch((err) => `**An error occurred:**\n\`\`\`${err}\`\`\``);
        
        await sleep(250);
    
        return res;
    } catch (e) {
        return `An error occurred: \`${e}\``;
    }
}