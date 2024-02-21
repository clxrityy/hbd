import { Schema, model } from "mongoose";

const birthdaySchema = new Schema({
    GuildID: String,
    UserID: String,
    Birthday: String,
},
    {
    strict: false
    });

export default model("Birthday", birthdaySchema);