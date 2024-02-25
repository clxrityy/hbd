import { model, Schema } from "mongoose";

const guildSchema = new Schema({
    GuildID: String,
    AnnouncementChannel: String,
    CommandsChannel: String,
    AdminRole: String,
    BirthdayRole: String,
    Changeable: Boolean,
},
    { strict: false },
);

export default model("Guild", guildSchema);