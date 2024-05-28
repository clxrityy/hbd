import { Request, Response } from "express";
import { fetchUser } from "../../services/user";

export async function getUser(req: Request, res: Response) {
    if (!req.user) return res.sendStatus(401);

    try {
        const { AccessToken: accessToken } = req.user;
        const user = await fetchUser(accessToken);

        res.send(user);
    } catch (err) {
        console.log(`[ERROR] API Error (getting user): ${err}`.red);
        res.sendStatus(400);
    }
}