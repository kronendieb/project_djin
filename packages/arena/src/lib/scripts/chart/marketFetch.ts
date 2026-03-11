import type { MarketParameters } from "@tzar/shared";
import type { Candle } from "@tzar/shared";

export const fetchMarketData = async (props: MarketParameters):Promise<Candle[]> => {
    const query= new URLSearchParams(props);
    const res = await fetch(`/api/marketdata/price-history?${query}`);
    const body = await res.json();

    if(!res.ok){
        throw new Error(body?.error ?? "Unknown Server Error");
    }

    return body;
}
