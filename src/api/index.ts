import express from "express";
import "colors"

const PORT = process.env.PORT || 3001;
const app = express();

const api = () => {
    app.get("/api/auth/discord/redirect", (req, res) => {
        console.log(req.query)
        res.send(200);
    });
    
    app.listen(PORT, () => { 
        console.log(`Server is running on port ${PORT}`.bgYellow.black);
    });
}

export default api;