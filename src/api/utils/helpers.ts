import url from "url";
import { OAuthTokenExchangeRequestParams } from "./types";
import { AxiosRequestConfig } from "axios";

export const buildOAuth2RequestPayload = (data: OAuthTokenExchangeRequestParams) => new url.URLSearchParams(data).toString();

export const authHeaders = (accessToken: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})