import crypto from "crypto";
import axios from "axios";
import app_env from "../models/environment";

export const generatePKCE = () => {
    const verifier = crypto.randomBytes(64).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    return {verifier, challenge};
};

export const exchangeAuthCode = async (code: string, verifier: string) => {
    const tokenURL = app_env.token_url;

    const params = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: app_env.callback_url,
        code_verifier: verifier,
    });

    const basicAuth = Buffer.from(
        `${app_env.key}:${app_env.secret}`
    ).toString("base64");

    const response = await axios.post(tokenURL, params.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
        },
    });

    return response.data;
}

export const refreshTokens = async (refreshToken: string) => {
    const tokenURL = app_env.token_url;
    
    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const basicAuth = Buffer.from(
        `${app_env.key}:${app_env.secret}`
    ).toString("base64");

    const response = await axios.post(tokenURL, params.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
        },
    });

    return response.data;
}
