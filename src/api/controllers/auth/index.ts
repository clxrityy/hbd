import { Request, Response } from "express";
import config from "../../../master/config";
import { createUser, encryptTokens, exchangeAccessCodeForCredentials, getUserDetails, revokeToken } from "../../services/auth";
import { serializeSession } from "../../utils/session";
import { AuthUserDocument } from "../../utils/types";

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

            const tokens = encryptTokens(access_token, refresh_token);

            const newAuthUser = await createUser({ id: id, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
        

            await serializeSession(req, newAuthUser as AuthUserDocument);

            res.send(newAuthUser);
        } catch (err) {
            console.log(`[ERROR] API Error: ${err}`.red);
            res.sendStatus(400);
        }
    }
}

export async function getAuthenticatedUserController(req: Request, res: Response) {
    
    return req.user ? res.send(req.user) : res.sendStatus(401);
}

export async function revokeAccessTokenController(req: Request, res: Response) {

    if (!req.user) return res.sendStatus(401);

    try {
        await revokeToken(req.user.AccessToken);
        res.sendStatus(200);
    } catch (err) {
        console.log(`[ERROR] API Error: ${err}`.red);
        res.sendStatus(400);
    }
}