import express from "express";
import { Router } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import app_env from "./models/environment";

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', true);

const router = Router();
router.use("/auth", authRouter)

app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
})
