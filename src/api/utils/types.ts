import AuthUser from "../../models/AuthUser";
import { Document } from "mongoose";

export enum DISCORD_API_ROUTES {
    OAUTH2_TOKEN = "https://discord.com/api/v10/oauth2/token",
    OAUTH2_USER = "https://discord.com/api/v10/users/@me",
    OAUTH2_TOKEN_REVOKE = "https://discord.com/api/v10/oauth2/token/revoke",
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
        user?: AuthUserDocument
    }
}

declare module "express" {
    interface Request {
        user?: AuthUserDocument
    }
}

export type AuthUserDocument = Document & typeof AuthUser & { AccessToken: string, RefreshToken: string, UserID: string };

export type EncrypyedTokens = {
    accessToken: string;
    refreshToken: string;
}