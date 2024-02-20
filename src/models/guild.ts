import { model, Schema } from "mongoose";

const guildSchema = new Schema({
    GuildID: String,
    Channels: {
        Announcement: String,
        Commands: String,
    },
    Roles: {
        Admin: String,
        Birthday: String,
    }
},
    { strict: false },
);

export default model("Guild", guildSchema);