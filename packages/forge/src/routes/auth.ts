import express, { Router, Request, Response } from "express";
import app_env from "../models/environment";
import { exchangeAuthCode, generatePKCE, refreshTokensIfNeeded } from "../models/schwabPKCE";
import { loadTokens, normalizeSchwabTokens, saveTokens, TokenAuthRequiredError } from "../models/tokenStore";

const authRouter = Router();

// The function that will be called back from schwab
authRouter.get("/", async (req: Request, res:Response) => {
    try {
        const code = req.query.code as string;
        const verifier = req.session.verifier;

        console.log("Code: ", code)
        console.log("Verifier: ", verifier)

        if (!code || !verifier){
            return res.status(400).send("Missing code or verifier");
        }

        const schwabTokens  = await exchangeAuthCode(code, verifier);
        const tokens = normalizeSchwabTokens(schwabTokens);
        saveTokens(tokens)
        req.session.tokens = tokens;

        res.redirect("/")
        //res.send("Successfull authentication, tokens stored in session");
    }catch (err: any){
        console.error(err.response?.data || err);
        res.status(500).send("Error during authentication");
    }
});

// This function refreshes the auth tokens, used when a schwab call is done.
authRouter.get("/refresh-tokens", async (req, res) => {
    try{
        await refreshTokensIfNeeded()
        const tokens = await loadTokens();
        req.session.tokens = tokens;
        res.json({
            authenticated: true,
            expires_at: tokens.expires_at,
        })
    }catch (err:any){
        if (err instanceof TokenAuthRequiredError){
            return res.status(401).json({authenticated:false});
        }
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }

});

// The function that checks the state of the refresh and access tokens
authRouter.get("/check-login", async (req, res) =>{
    try {
        await refreshTokensIfNeeded();
        const tokens = await loadTokens();
        req.session.tokens = tokens;

        res.json({
            authenticated: true,
            expires_at: tokens.expires_at,
        });
    } catch (err: any){
        if(err instanceof TokenAuthRequiredError){
            return res.status(401).json({authenticated:false});
        }
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    }
});

// Test function for the endpoint
authRouter.get("/test", (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

// The function that sends the client the redirect to the login website.
authRouter.get("/login-url", (req: Request, res: Response) => {
    const {verifier, challenge} = generatePKCE();
    req.session.verifier = verifier;

    console.log("Verifier: ", verifier)
    console.log("Session Stored Verifier: ", req.session.verifier)

    const params = new URLSearchParams({
        client_id: app_env.key,
        redirect_uri: app_env.callback_url,
        response_type: "code",
        code_challenge: challenge,
        code_challenge_methode: "S256",
    });
    console.log(params);

    res.json({url:app_env.auth_url + "?" + params});
});

export default authRouter;
