import { Client, Guild, GuildMember, Role } from "discord.js";
import Birthday from "../../models/Birthday";
import GuildModel from "../../models/Guild";
import "colors";

module.exports = async (client: Client, ...args: string[]) => {
    const userId = args[0][0];
    const guildId = args[0][1];

    let userData = await Birthday.findOne({ GuildID: guildId, UserID: userId });

    if (!userData) return;

    let guildData = await GuildModel.findOne({ GuildID: guildId });

    if (!guildData.BirthdayRole) return;

    let targetGuild: Guild;

    client.guilds.cache.forEach((guild) => {
        if (guild.id === guildId) {
            targetGuild = guild;
        }
    })

    if (targetGuild.id != guildId) return;

    let user: GuildMember;

    targetGuild.members.cache.forEach((member) => {
        if (member.id === userId) {
            user = member;
        }
        return;
    })

    let birthdayRole: Role;

    targetGuild.roles.cache.forEach((role) => {
        if (role.id === guildData.BirthdayRole) {
            birthdayRole = role;
        }
        return;
    });
    try {
        return await user.roles.add(birthdayRole);
    } catch (err) {
        console.log(`[ERROR] Error adding birthday role!\n${err}`.red);
    }
   
}