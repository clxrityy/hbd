import { Request, Response } from "express";
import AuthUser from "../../models/AuthUser";
import AuthSession from "../../models/AuthSession";



export async function serializeSession(req: Request, user: typeof AuthUser) {
    req.session.user = user;
    req.user = user;

    const session = new AuthSession({
        SessionID: req.sessionID,
        ExpiresAt: req.session.cookie.expires,
        Data: JSON.stringify(user)
    });

    try {
        await session.save();
    } catch (err) {
        console.log(`[ERROR] API Error (saving session): ${err}`.red);
    }

    return session;
}

export async function deserializeSession() {
    
}