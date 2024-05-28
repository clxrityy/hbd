import express from "express";
import session from "express-session";
import "colors";
import router from "./routes";
import cookieParser from "cookie-parser";


const api = async () => {

    const PORT = process.env.PORT || 3001;
    const app = express();

    try {
        app.use(cookieParser(process.env.SESSION_SECRET));

        app.use(session({
            secret: process.env.SESSION_SECRET,
            name: "OAUTH2_SESSION_ID",
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 3600000 * 24,
            }
        }));

        const { deserializeSession } = await import("./utils/session");

        app.use(deserializeSession);

        app.use("/api", router)

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`.bgYellow.black);
        });
    } catch (err) {
        console.log(`[ERROR] API Error: ${err}`.red);
    }

    // app.get(`/api/auth/revoke`, async (req, res) => {
    //     const formData = new url.URLSearchParams({
    //         client_id: process.env.CLIENT_ID,
    //         client_secret: process.env.CLIENT_SECRET,
    //         token: accessToken,
    //     })

    //     try {
    //         const response = await axios.post(`${config.api.endpoint}/oauth2/token/revoke`, formData.toString(), {
    //             headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //             }
    //         });

    //         res.send(response.data);
    //     } catch (err) {
    //         console.log(`[ERROR] API Error: ${err}`.red);
    //         res.sendStatus(400);
    //     }
    // });
}

export default api;