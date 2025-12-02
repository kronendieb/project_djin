import express, { Router, Request, Response } from "express";
import app_env from "../models/environment";
import crypto, { generatePrime } from "crypto"
import axios from "axios";

const authRouter = Router();

const generatePKCE = () => {
    const verifier = crypto.randomBytes(64).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    return {verifier, challenge};
};

// The function that will be called back from schwab
authRouter.get("/", async (req: Request, res:Response) => {
    /*
    console.log("Redirecting to Index.");
    const params = new URLSearchParams(req.query as Record<string, string>).toString();

    console.log(params)

    res.redirect("/")
     * */


    const code = req.query.code as string;
    const verifier = req.session.verifier as string;

    const data = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: app_env.key + "@AMER.OAUTHAP",
        redirect_uri: app_env.callback_url,
        code_verifier: verifier,
    });

    const tokenRes = await axios.post(app_env.token_url, data);
    console.log(tokenRes.data);
    req.session.refresh_token = tokenRes.data.refresh_token;

    res.redirect("/");
});

authRouter.get("/refresh-tokens", (req, res) => {
    const refresh_token = req.session.refresh_token;

    const data = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: app_env.key + "@AMER.OAUTHAP",
    });
});

// The function that checks the state of the refresh and access tokens
authRouter.get("/check_login", (req, res) =>{
    res.json({status: "not logged in."});
});

// Test function for the endpoint
authRouter.get("/test", (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

// The function that sends the client the redirect to the login website.
authRouter.get("/login-url", (req: Request, res: Response) => {
    console.log("Login Redirect.")
    //res.json({url: `${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`});
    const {verifier, challenge} = generatePKCE();
    req.session.verifier = verifier;

    const params = new URLSearchParams({
        client_id: app_env.key + "@AMER.OAUTHAP",
        redirect_uri: app_env.callback_url,
        response_type: "code",
        code_challenge: challenge,
        code_challenge_methode: "S256",
    });
    console.log(params);

    res.json({url:app_env.auth_url + "?" + params});
});

export default authRouter;
