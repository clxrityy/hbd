import { Schema, model } from "mongoose";

const birthdaySchema = new Schema({
    GuildID: String,
    UserID: String,
    Birthday: Date || Number,
},
    {
    strict: false
    });

export default model("Birthday", birthdaySchema);