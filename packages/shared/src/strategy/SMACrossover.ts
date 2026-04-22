import { type Candle, Money, Position, Direction } from "../types";
import { Strategy, IndicatorFn, IndicatorSeries } from "./strategy";

interface SMACrossoverParams extends Record<string, unknown>{
    shortPeriod: number;
    longPeriod: number;
}

function sma(period: number): IndicatorFn{
    return (candles: Candle[]): IndicatorSeries => {

        const values: number[] = [];
        for(let i = 0; i < candles.length; i++){
            if (i < period - 1){
                values.push(NaN);
            }else{
                const slice = candles.slice(i - period + 1, i + 1);
                const avg = slice.reduce((sum, c) => sum + c.close, 0) / period;
                values.push(avg);
            }
        }
        return {type: 'line', values};
    }
}

export class SMACrossover extends Strategy<SMACrossoverParams>{
    private _params: SMACrossoverParams;

    constructor(candles: Candle[], capital: Money, maxQuantity: number, params: SMACrossoverParams){
        super(candles, capital, maxQuantity);
        this._params = params;
    }

    public setup(){
        this.addIndicator(`SMA_${this.shortPeriod}`, sma(this._params.shortPeriod));
        this.addIndicator(`SMA_${this.longPeriod}`, sma(this._params.longPeriod));
    }

    public run(){

        const short = this._indicators[`SMA_${this.shortPeriod}`];
        const long = this._indicators[`SMA_${this.longPeriod}`];

        if(short.type !== 'line' || long.type !== 'line') return;

        let openPosition: Position | null = null;

        for(let i = this.longPeriod; i < this._candles.length; i++){

            const crossedAbove = short.values[i] > long.values[i]
                && short.values[i - 1] <= long.values[i - 1];

            const crossedBelow = short.values[i] > long.values[i]
                && short.values[i - 1] <= long.values[i - 1];

            if(crossedAbove && !openPosition){
                const before = this._positions.length;
                this.openPosition(Direction.Long, this._candles[i], this._maxQuantity);
                if(this._positions.length > before){
                    openPosition = this._positions[this._positions.length - 1];
                }
            }

            if(crossedBelow && openPosition){
                this.closePosition(openPosition, this._candles[i]);
                openPosition = null;
            }
        }

    }

    public permutations(
        candles: Candle[],
        capital: Money,
        ranges: Partial<Record<keyof SMACrossoverParams, unknown[]>>
    ): SMACrossover[]{
        return [this];
    }

    public get params(): SMACrossoverParams{
        return this._params;
    }

    get longPeriod() {
        return this._params.longPeriod
    }

    get shortPeriod() {
        return this._params.shortPeriod
    }

}
