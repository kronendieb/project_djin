import express, { Router, Request, Response } from "express";
import app_env from "../models/environment";

const authRouter = Router();

const constructHeaders = (returned_url: String) => {
    const response_code = `${returned_url}`;
    const credentials  = '';

    return 1
}

authRouter.get("/", (req: Request, res:Response) => {
    console.log("Redirecting to Index.");
    const params = new URLSearchParams(req.query as Record<string, string>).toString();

    console.log(params)

    res.redirect("/")
});

authRouter.get("/check_login", (req, res) =>{
    res.json({status: "not logged in."});
});

authRouter.get("/test", (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

authRouter.get("/login-url", (req, res) => {
    console.log("Login Redirect.")
    res.json({url: `${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`});
});

export default authRouter;
