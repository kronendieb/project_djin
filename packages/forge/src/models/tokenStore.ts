import fs from "fs";
import path from "path";
import app_env from "./environment";
import { refreshTokens } from "../routes/schwabPKCE";

const TOKEN_FILE = path.resolve(app_env.token_file);

export interface StoredTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export const saveTokens = (tokens: StoredTokens) => {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens))
}

export const LoadTokens = ():StoredTokens | null => {
    if (!fs.existsSync(TOKEN_FILE)) return null;

    const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));

    return tokens;
}

export const isExpired = (expiresAt: number, bufferSeconds = 60) => {
    return Date.now() > expiresAt - (bufferSeconds * 1000)
}

export const getValidAccessToken = async () => {
    let tokens = LoadTokens();

    if (!tokens) {
        throw new Error("No stored tokens found, must authenticate user.")
    }

    if (isExpired(tokens.expires_at)){
        console.log("Access token expired. Refreshing");

        const refreshed = await refreshTokens(tokens.refresh_token);

        tokens = {
            access_token: refreshed.access_token,
            refresh_token: refreshed.refresh_token ?? tokens.refresh_token,
            expires_at: Date.now() + refreshed.expires_in * 1000,
        };

        saveTokens(tokens);
    }
}
