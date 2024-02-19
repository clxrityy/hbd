import "colors";
import db from "../../lib/db";

module.exports = async () => {
    await db().catch((err) => console.log(`[ERROR] Error connecting to database! \n${err}`.red));
}