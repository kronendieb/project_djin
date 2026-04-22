import { type Candle, Money, Strategy } from "@tzar/shared";

interface SMACrossoverParams extends Record<string, unknown>{
    shortPeriod: number;
    longPeriod: number;
}

class SMACrossoverStrategy extends Strategy<SMACrossoverParams>{

    private _params: SMACrossoverParams;

    constructor(candles: Candle[], capital: Money, maxQty: number, params: SMACrossoverParams){
        super(candles, capital, maxQty);
        this._params = params;
    }

    public setup(){
        this.addIndicator(`SMA_${this._params.shortPeriod}`, sma)
    }

    public run() {

    }

    public permutations(
        candles: Candle[],
        capital: Money,
        ranges: Partial<Record<keyof SMACrossoverParams, unknown[]>>
    ): SMACrossoverStrategy[]{
        return [this];
    }

    public get params(): SMACrossoverParams{
        return this._params;
    }
}
