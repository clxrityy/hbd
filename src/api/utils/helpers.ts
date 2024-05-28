import url from "url";
import { OAuthTokenExchangeRequestParams } from "./types";
import { AxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";

export const encryptToken = (token: string) => CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_KEY);

export const decryptToken = (encrypted: string) => CryptoJS.AES.decrypt(encrypted, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

export const buildOAuth2RequestPayload = (data: OAuthTokenExchangeRequestParams) => new url.URLSearchParams(data).toString();

export const authHeaders = (accessToken: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})