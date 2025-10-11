import express from "express";
import { Router } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import session from "express-session";
import "@shared/types/express-session"

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('trust proxy', true);

const router = Router();
router.use("/auth", authRouter)

app.use("/api", router);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "replace_this_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        },
    })
)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})
