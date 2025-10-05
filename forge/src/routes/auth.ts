import { Router } from "express";
import app_env from "../models/environment";

const authRouter = Router();

const constructHeaders = (returned_url: String) => {
    const response_code = `${returned_url}`;
    const credentials  = '';

    return 1
}

authRouter.get("/", (req, res) => {
    console.log("Redirecting");
    res.json({url:"/api/auth/test"});
    //res.redirect(`${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`)
    //res.json({url: `${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`});
});

authRouter.get("/check_login", (req, res) =>{
    console.log("Hello from the redirect!");
    res.json({status: "not logged in."});
});

authRouter.get("/test", (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

export default authRouter;
