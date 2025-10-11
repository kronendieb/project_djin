"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const environment_1 = __importDefault(require("../models/environment"));
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const authRouter = (0, express_1.Router)();
const generatePKCE = () => {
    const verifier = crypto_1.default.randomBytes(64).toString("base64url");
    const challenge = crypto_1.default.createHash("sha256").update(verifier).digest("base64url");
    return { verifier, challenge };
};
// The function that will be called back from schwab
authRouter.get("/", async (req, res) => {
    /*
    console.log("Redirecting to Index.");
    const params = new URLSearchParams(req.query as Record<string, string>).toString();

    console.log(params)

    res.redirect("/")
     * */
    const { code } = req.query;
    const verifier = req.session.verifier;
    const data = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: environment_1.default.key + "@AMER.OAUTHAP",
        redirect_uri: environment_1.default.callback_url,
        code_verifier: verifier,
    });
    const tokenRes = await axios_1.default.post(environment_1.default.token_url, data);
    req.session.tokens = tokenRes.data;
    res.redirect("/");
});
authRouter.get("/refresh-tokens", (req, res) => {
    const data = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: environment_1.default.key + "@AMER.OAUTHAP",
    });
});
// The function that checks the state of the refresh and access tokens
authRouter.get("/check_login", (req, res) => {
    res.json({ status: "not logged in." });
});
// Test function for the endpoint
authRouter.get("/test", (req, res) => {
    let x = Math.random() * 3;
    res.send(`${x}`);
});
// The function that sends the client the redirect to the login website.
authRouter.get("/login-url", (req, res) => {
    console.log("Login Redirect.");
    //res.json({url: `${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`});
    const { verifier, challenge } = generatePKCE();
    req.session.verifier = verifier;
    const params = new URLSearchParams({
        client_id: environment_1.default.key + "@AMER.OAUTHAP",
        redirect_uri: environment_1.default.callback_url,
        response_type: "code",
        code_challenge: challenge,
        code_challenge_methode: "S256",
    });
    res.redirect(environment_1.default.auth_url + "?" + params);
});
exports.default = authRouter;
