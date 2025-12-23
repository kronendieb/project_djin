import fs ,{promises} from "fs";
import path from "path";
import app_env from "./environment";
import { Request, Response, NextFunction } from "express";
import { refreshTokens, refreshTokensIfNeeded } from "./schwabPKCE";

const TOKEN_FILE = path.resolve(app_env.token_file);

export interface StoredTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export interface SchwabTokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    id_token?: string;
}

export class TokenAuthRequiredError extends Error {
    constructor(message = "Authentication Required") {
        super(message);
        this.name = "TokenAuthRequiredError";
    }
}

export const expirationDate = (expires_in:number) => {
    return Date.now() + expires_in * 1000;
}

export const normalizeSchwabTokens = (
    res: SchwabTokenResponse,
    prev?: StoredTokens):StoredTokens => {
    if(!res.access_token){
        throw new Error("Missing access token from Schwab");
    }

    return {
        access_token: res.access_token,
        refresh_token: res.refresh_token ?? prev?.refresh_token ?? (() => {
            throw new Error("Missing refresh token");
        })(),
        expires_at: expirationDate(res.expires_in)
    }
}

export const getSessionTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        let tokens = await loadTokens()
        req.session.tokens = tokens;
        next();
    }catch (err){
        return res.status(401).json({error: err})
    }
}

export const saveTokens = async (tokens: StoredTokens) => {
    try{
        await promises.writeFile(TOKEN_FILE, JSON.stringify(tokens));
    }catch (err: any){
        throw err;
    }
}

export const loadTokens = async ():Promise<StoredTokens> => {
    if (!fs.existsSync(TOKEN_FILE)) throw new TokenAuthRequiredError();
    try{
        const data = await promises.readFile(TOKEN_FILE, "utf8");
        return JSON.parse(data) as StoredTokens;
    } catch (err: any){
        if (err.code === "ENOENT"){
            throw new TokenAuthRequiredError();
        }
        throw err;
    }
}

export const isExpired = (expiresAt: number, bufferSeconds = 60) => {
    return Date.now() > expiresAt - (bufferSeconds * 1000)
}

export const getValidAccessToken = async ():Promise<string> => {
    await refreshTokensIfNeeded();
    let tokens = await loadTokens();

    if (!tokens) {
        throw new TokenAuthRequiredError();
    }

    if(!isExpired(tokens.expires_at)){
        return tokens.access_token;
    }

    try {
        const refreshed = await refreshTokens(tokens.refresh_token);

        const newTokens = {
            access_token: refreshed.access_token,
            refresh_token: refreshed.refresh_token,
            expires_at: Date.now() + refreshed.expires_in * 1000,
        }

        await saveTokens(newTokens);
        return newTokens.access_token;
    }catch (err: any){
        if(
            err.response?.status === 400 ||
            err.response?.status === 401
        ){
            throw new TokenAuthRequiredError();
        }
        throw err;
    }

}
