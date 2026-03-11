import { loadTokens, StoredTokens } from "../models/tokenStore";
import axios from "axios";
import app_env from "../models/environment";
import type { Candle } from "@tzar/shared";
import type { MarketParameters } from "@tzar/shared";

export const getPriceHistory = async (
    token: StoredTokens,
    params: MarketParameters
) => {

    const response = await axios.get(
        `${app_env.marketdata_url}/pricehistory`,
        {
            headers:{
                Authorization: `Bearer ${token.access_token}`,
            },
            params: {
                symbol: params.symbol,
                periodType: params.periodType,
                period: params.period,
                frequencyType: params.frequencyType,
                frequency: params.frequency,
                needExtendedHoursData: false,
            },
        }
    )
    return response.data;

}

export const normalizePriceHistory = (data: any[]): Candle[] => {

    if(!data){
        throw new Error("Missing data to normalize");
    }

    return data.map(c => ({
        time: c.datetime,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume
    }));
}

