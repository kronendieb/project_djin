import express from "express";
import { Router } from "express";
import cors from "cors";
import 'dotenv/config';
import authRouter from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', true);

const router = Router();
router.use("/auth", authRouter)

app.use("/api", router);

const app_env = {
    port: `${process.env.PORT}`,
    key: `${process.env.APP_KEY}`,
    secret: `${process.env.APP_SECRET}`,
    callback_url: `${process.env.APP_CALLBACK_URL}`,
    token_file: `${process.env.APP_TOKEN_NAME}`,
    auth_url: `${process.env.APP_AUTH_URL}`,
    token_url: `${process.env.APP_TOKEN_URL}`,
}



app.get("/", (req, res) => {
    console.log(`IP of the request:${req.ip}`)
    res.send("This is the index page")
    //res.redirect(`${app_env.auth_url}?client_id=${app_env.key}&redirect_uri=${app_env.callback_url}`)
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})
