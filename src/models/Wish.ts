import { Schema, model } from "mongoose";

export const wishSchema = new Schema({
    GuildID: String,
    TargetUserID: String,
    UserID: String,
    Year: Number,
    Message: String,
}, {
    strict: false
});

export default model("Wish", wishSchema);