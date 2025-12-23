import express from "express";
import { Router } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import session from "express-session";
import app_env from "./models/environment";
import { endpointLog } from "./controllers/logging";
import { marketDataRouter } from "./routes/marketData";

const app = express();
app.use(cors({origin: "...", credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('trust proxy', true);

app.use(
    session({
        secret: app_env.session_secret!,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            domain: '127.0.0.1',
            maxAge: 1000 * 60 * 60,
        },
    })
)

app.use(endpointLog)

const mainRouter = Router();
mainRouter.use("/auth", authRouter)
mainRouter.use("/marketdata", marketDataRouter)

app.use("/api", mainRouter);

const PORT = app_env.port || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log("If nginx is enabled use https://127.0.0.1")
})
