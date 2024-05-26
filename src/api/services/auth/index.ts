import axios from "axios";
import { CreateUserParams, DISCORD_API_ROUTES, OAuth2CredentialsResponse, OAuth2UserResponse, OAuthTokenExchangeRequestParams } from "../../utils/types";
import { axiosConfig } from "../../utils/constants";
import { authHeaders, buildOAuth2RequestPayload } from "../../utils/helpers";
import AuthUser from "../../../models/AuthUser";

export async function exchangeAccessCodeForCredentials(data: OAuthTokenExchangeRequestParams) {
    const payload = buildOAuth2RequestPayload(data);

    return await axios.post<OAuth2CredentialsResponse>(DISCORD_API_ROUTES.OAUTH2_TOKEN, payload, axiosConfig)
}

export async function getUserDetails(accessToken: string) {
    return await axios.get<OAuth2UserResponse>(DISCORD_API_ROUTES.OAUTH2_USER, authHeaders(accessToken));
}

export async function createUser(params: CreateUserParams) {
    const existingUser = await AuthUser.findOne({ id: params.id });

    if (existingUser.UserID === params.id) {
        try {
            await existingUser.updateOne({
                AccessToken: params.accessToken,
                RefreshToken: params.refreshToken,
            });
    
            await existingUser.save();
            return existingUser;
        } catch (err) {
            console.log(`[ERROR] API Error (updating user): ${err}`.red);
            return null;
        }
    } else {
        try {
            const newUser = new AuthUser({
                UserID: params.id,
                AccessToken: params.accessToken,
                RefreshToken: params.refreshToken,
            });
    
            await newUser.save();
            return newUser;
        } catch (err) {
            console.log(`[ERROR] API Error (creating user): ${err}`.red);
            return null;
        }
    }
    
}