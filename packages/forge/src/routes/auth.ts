import express, { Router, Request, Response } from "express";
import app_env from "../models/environment";
import { exchangeAuthCode, generatePKCE } from "./schwabPKCE";

const authRouter = Router();

// The function that will be called back from schwab
authRouter.get("/", async (req: Request, res:Response) => {
    try {
        const code = req.query.code as string;
        const verifier = req.session.verifier;

        console.log("Code: ", code)
        console.log("Verifier: ", verifier)
        console.log("SessionID: ", req.sessionID)
        console.log("Session: ", req.session)

        if (!code || !verifier){
            return res.status(400).send("Missing code or verifier");
        }

        const tokens = await exchangeAuthCode(code, verifier);
        req.session.tokens = tokens;

        res.redirect("/")
        //res.send("Successfull authentication, tokens stored in session");
    }catch (err: any){
        console.error(err.response?.data || err);
        res.status(500).send("Error during authentication");
    }
});

// This function refreshes the auth tokens, used when a schwab call is done.
authRouter.get("/refresh-tokens", (req, res) => {
    const refresh_token = req.session.refresh_token;

    const data = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: app_env.key,
    });
});

// The function that checks the state of the refresh and access tokens
authRouter.get("/check-login", (req, res) =>{
    const refresh_tokens = req.session.tokens;
    console.log("Tokens: ", refresh_tokens)
    if(!refresh_tokens){
        res.json({status: "not logged in."});
    }

    else{
        res.json(refresh_tokens);
    }
});

// Test function for the endpoint
authRouter.get("/test", (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

// The function that sends the client the redirect to the login website.
authRouter.get("/login-url", (req: Request, res: Response) => {
    //res.json({url: `${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`});
    const {verifier, challenge} = generatePKCE();
    req.session.verifier = verifier;

    console.log("Verifier: ", verifier)
    console.log("SessionID: ", req.sessionID)
    console.log("Session: ", req.session)
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
