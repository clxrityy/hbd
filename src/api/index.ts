import express from "express";
import "colors";
import router from "./routes";

const api = async () => {

    const PORT = process.env.PORT || 3001;
    const app = express();

    app.use("/api", router)

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`.bgYellow.black);
    });



    // app.get("/api/auth/discord/redirect", async (req, res) => {

    //     const { code } = req.query;

    //     if (code) {
    //         try {
    //             const formData = new url.URLSearchParams({
    //                 client_id: process.env.CLIENT_ID,
    //                 client_secret: process.env.CLIENT_SECRET,
    //                 grant_type: "authorization_code",
    //                 code: code.toString(),
    //                 redirect_uri: config.api.redirect_uri,
    //                 scope: "identify"
    //             });

    //             const response = await axios.post(`${config.api.endpoint}/oauth2/token`, formData.toString(), {
    //                 headers: {
    //                     "Content-Type": "application/x-www-form-urlencoded"
    //                 }
    //             });

    //             const { access_token, refresh_token } = response.data;
    //             accessToken = access_token;
    //             refreshToken = refresh_token;



    //             res.send(200);
    //         } catch (err) {
    //             console.log(`[ERROR] API Error: ${err}`.red);
    //             res.sendStatus(400);
    //         }
    //     }
    // });

    // app.get(`/api/auth/user`, async (req, res) => {
    //     try {
    //         const response = await axios.get(`${config.api.endpoint}/users/@me`, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`
    //             }
    //         });

    //         res.send(response.data);
    //     } catch (err) {
    //         console.log(`[ERROR] API Error: ${err}`.red);
    //         res.sendStatus(400);
    //     }
    // });

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