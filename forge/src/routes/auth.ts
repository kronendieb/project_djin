import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
    res.send("This is the auth service")
})

export default authRouter;
