import { Schema, model } from "mongoose";

const whitelistSchema = new Schema({
    GuildID: String,
    RoleID: String,
    CommandName: String,
}, {
    strict: false
});

export default model("Whitelist", whitelistSchema);