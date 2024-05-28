import { AuthUserDocument } from './types';
import cookieParser from 'cookie-parser';
import { Request, Response } from "express";
import AuthUser from "../../models/AuthUser";
import AuthSession from "../../models/AuthSession";



export async function serializeSession(req: Request, user: AuthUserDocument) {
    req.session.user = user;
    req.user = user;

    // req.session.touch();

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

export async function deserializeSession(req: Request, res: Response, next: Function) {
    const { OAUTH2_SESSION_ID } = req.cookies;

    const sessionId = cookieParser.signedCookie(OAUTH2_SESSION_ID, process.env.SESSION_SECRET);

    console.log(OAUTH2_SESSION_ID)

    const currentSession = await AuthSession.findOne({ SessionID: sessionId });

    const currentTime = new Date();

    if (!currentSession) return next();

    if (currentSession.ExpiresAt < currentTime) {
        await AuthSession.deleteOne({ SessionID: sessionId });
    } else {
        const data = JSON.parse(currentSession.Data)
        req.user = data;
        next();
    }

    next();
}