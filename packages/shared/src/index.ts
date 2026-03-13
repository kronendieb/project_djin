export type {Candle} from "./types/candles";
export type {MarketParameters} from "./types/marketParameters";
export {FrequencyTypes,  PeriodToFrequencyTypes, PeriodTypes} from "./types/marketParameters";

export interface RedirectURL {
    url: string;
}

export interface ResStatus {
    status: string;
}

export interface User{
    user: string;
}
