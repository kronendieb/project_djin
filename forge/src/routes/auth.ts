import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
    res.send("This is the auth service")
})

authRouter.get("/test", (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

export default authRouter;
