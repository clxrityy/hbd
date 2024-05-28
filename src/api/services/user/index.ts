import axios from "axios";
import { authHeaders, decryptToken } from "../../utils/helpers";
import { DISCORD_API_ROUTES, OAuth2UserResponse } from "../../utils/types";


export async function fetchUser(accessToken: string): Promise<OAuth2UserResponse> {
    const decryptedToken = decryptToken(accessToken);

    return await axios.get(DISCORD_API_ROUTES.OAUTH2_USER, authHeaders(decryptedToken));
}