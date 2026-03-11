import { Router, Request, Response } from "express";
import { refreshTokensIfNeeded } from "../models/schwabPKCE";
import { getPriceHistory, normalizePriceHistory } from "../models/priceHistory";
import { loadTokens } from "../models/tokenStore";
import type { MarketParameters } from "@tzar/shared";

export const marketDataRouter = Router()

marketDataRouter.get("/test", async (req, res) => {
    let x: number = Math.random() * 3;
    res.send(`${x}`)
})

marketDataRouter.get("/price-history", async (
    req: Request<{}, {}, {}, MarketParameters>,
    res: Response
) => {
        try {
            await refreshTokensIfNeeded();
            const tokens = await loadTokens();
            const {symbol, periodType, period, frequencyType, frequency} = req.query;

            const response = await getPriceHistory(
                tokens,
                {symbol, periodType, period, frequencyType, frequency}
            );
            const candles = normalizePriceHistory(response.candles);

            res.json(candles);
        } catch (err: any){
            if(err.response?.status === 401){
                return res.status(401).json({error:"Token expired"});
            }
            console.error(err.response?.data || err)
            res.status(500).json({error:"Failed to fetch price history"})
        }
    })
