import openai from "./openai";
import config from "../config";
import guild from "../models/guild";

/*
    a sleep function to make sure the AI gets a good night's rest before it has to get back to work
*/
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const query = async (prompt: string, guildId: string) => {
    
    let guildData = await guild.findOne({ GuildID: guildId });

    if (!guildData) {
        guildData = new guild({
            GuildID: guildId,
            Temperature: config.openai.temperature,
            SystemRoleContent: config.openai.systemRoleContent,
            PresencePenalty: config.openai.presence_penalty,
            Model: config.openai.model,
        });

        await guildData.save();
    }
    
    if (!prompt || prompt.length < 1) return false;


    const res = await openai.chat.completions.create({
        model: guildData.Model,
        messages: [
            {
                role: "system",
                content: guildData.SystemRoleContent
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: guildData.Temperature,
        presence_penalty: guildData.PresencePenalty
    })
        .then((res) => res.choices[0].message)
        .catch((err) => `**Error with query!**\n${err}`);
    
    await sleep(500);

    if (typeof res === 'object') {
        return res.content;
    }

    return res;
}

export default query;