import { Client, Guild, GuildMember, Role } from "discord.js";
import Birthday from "../../models/Birthday";
import GuildModel from "../../models/Guild";
import "colors";

module.exports = (client: Client) => {

    const handleInterval = async (client: Client) => {

        let date = new Date();

        let filter = {};

        let birthdayRole: Role;
        let targetGuild: Guild;
        let user: GuildMember;

        const birthdays = await Birthday.find(filter);
        const dateString = date.toLocaleDateString();
        const dateArray = dateString.split("/");
        const nextDay = Number(dateArray[1]) + 1;
        const dateParsed = dateArray[0] + `/` + dateArray[1];

        for (const birthday of birthdays) {
            const guildId = birthday.GuildID;
            let guildData = await GuildModel.findOne({ GuildID: guildId });

            if (!guildData.BirthdayRole) return;

            const birthdayArray = birthday.Birthday.split("/");

            const dayAfter = Number(birthdayArray[1]) + 1;

            if (nextDay === dayAfter || birthday.Birthday != dateParsed) {

                client.guilds.cache.forEach((guild) => {
                    if (guild.id === guildId) {
                        targetGuild = guild;
                    }
                });

                targetGuild.members.cache.forEach((member) => {
                    if (member.id === birthday.UserID) {
                        user = member;
                    }
                });

                targetGuild.roles.cache.forEach((role) => {
                    if (role.id === guildData.BirthdayRole) {
                        birthdayRole = role;
                    }
                });

                user.roles.cache.forEach(async (role) => {
                    if (role === birthdayRole) {
                        try {
                            await user.roles.remove(birthdayRole).then(() => { 
                                console.log(`[INFO] Removed birthday role from ${user.user.tag} in ${targetGuild.name}`.green);
                            })
                        } catch (err) {
                            console.log(`[ERROR] Error removing birthday role!\n${err}`.red);
                        }
                    }
                })
            }
        }
    }
    return setInterval(async () => await handleInterval(client), 1000 * 60 * 60 * 24); // change to 24 hr
    // 1000 * 60 * 60 = 1 hr
}