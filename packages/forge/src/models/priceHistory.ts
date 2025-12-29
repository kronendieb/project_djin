import { loadTokens, StoredTokens } from "../models/tokenStore";
import axios from "axios";
import app_env from "../models/environment";

export const getPriceHistory = async (token: StoredTokens, symbol: string) => {

    const response = await axios.get(
        `${app_env.marketdata_url}/pricehistory`,
        {
            headers:{
                Authorization: `Bearer ${token.access_token}`,
            },
            params: {
                symbol,
                periodType: "year",
                period: 1,
                frequencyType: "daily",
                frequency: 1,
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

