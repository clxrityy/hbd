import "colors";
import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

const db = async () => {
    if (!mongoURI) {
        console.log(`[WARNING] Missing MONGO_URI environment variable!`.bgRed);
    }

    mongoose.set("strictQuery", true);

    try {
        if (await mongoose.connect(mongoURI)) {
            console.log(`[INFO] Connected to the database!`.bgCyan);
        }
    } catch (err) {
        console.log(`[ERROR] Couldn't establish a MongoDB connection!\n${err}`.red);
    }
}

export default db;