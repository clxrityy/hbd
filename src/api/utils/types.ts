import AuthUser from "../../models/AuthUser";
import { Document } from "mongoose";

export enum DISCORD_API_ROUTES {
    OAUTH2_TOKEN = "https://discord.com/api/oauth2/token",
    OAUTH2_USER = "https://discord.com/api/users/@me",
}

export type OAuthTokenExchangeRequestParams = {
    client_id: string;
    client_secret: string;
    grant_type: string;
    code: string;
    redirect_uri: string;
}

export type OAuth2CredentialsResponse = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export type OAuth2UserResponse = {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    email?: string;
    verified?: boolean;
    public_flags: number
    flags: number;
    banner: string | null;
    banner_color: string | null;
    accent_color: string | null;
    locale: string;
    mfa_enabled: boolean;
}

export type CreateUserParams = {
    id: string;
    accessToken: string;
    refreshToken: string;
}

declare module "express-session" {
    interface SessionData {
        user?: typeof AuthUser
    }
}

declare module "express" {
    interface Request {
        user?: typeof AuthUser
    }
}

export type AuthUserDocument = typeof AuthUser & Document;