import { Request, Response } from "express";
import config from "../../../master/config";
import { createUser, exchangeAccessCodeForCredentials, getUserDetails } from "../../services/auth";

export async function authDiscordRedirectController(req: Request, res: Response) { 
    const { code } = req.query;

    if (code) {
        try {
            const response = await exchangeAccessCodeForCredentials({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "authorization_code",
                code: code.toString(),
                redirect_uri: config.api.redirect_uri,
            });
            
            const { access_token, refresh_token } = response.data;

            const { data: user } = await getUserDetails(access_token);
            const { id } = user;

            const newAuthUser = await createUser({ id: id, accessToken: access_token, refreshToken: refresh_token });

            res.send(newAuthUser);
        } catch (err) {
            console.log(`[ERROR] API Error: ${err}`.red);
            res.sendStatus(400);
        }
    }
}

export async function getAuthenticatedUserController(req: Request, res: Response) {
    res.sendStatus(200);
}

export async function revokeAccessTokenController(req: Request, res: Response) {
    res.sendStatus(200);
}