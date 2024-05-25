import express from "express";
import "colors";
import axios from "axios";
import config from "../master/config";

const PORT = process.env.PORT || 3001;
const app = express();

const api = () => {
    app.get("/api/auth/discord/redirect", async (req, res) => {
        console.log(req.query)
        const { code } = req.query;

        const response = await axios.post(`${config.api.base_url}/oauth2/token`, {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: config.api.redirect_uri,
            scope: "identify"
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    });
    
    app.listen(PORT, () => { 
        console.log(`Server is running on port ${PORT}`.bgYellow.black);
    });
}

export default api;