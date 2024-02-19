import { model, Schema } from "mongoose";

const guildSchema = new Schema({
    GuildID: String,
    SystemRoleContent: String,
    Temperature: Number,
    PresencePenalty: Number,
    Model: String,
},
    { strict: false },
);

export default model("guild", guildSchema);