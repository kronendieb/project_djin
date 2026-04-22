import { Candle, Money, Position, Direction } from "../types";

export type IndicatorFn = (candles: Candle[]) => IndicatorSeries;

export type IndicatorSeries = 
    | { type: 'line'; values: number[];}
    | { type: 'band'; upper: number[]; middle: number[]; lower: number[];}
    | { type: 'macd'; macd: number[]; signal: number[]; histogram: number[];}
    | { type: 'histogram'; values: number[];}
    | { type: 'signal'; indices: number[]; direction: Direction}

export interface StrategyIndicators{
    [key: string]: IndicatorSeries;
}

export interface BacktestResult{
    startingCapital: Money;
    endingCapital: Money;
    positions: Position[];
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalReturn: number;
}

export abstract class Strategy<TParams extends Record<string, unknown>>{
    protected _candles: Candle[];
    protected _capital: Money;
    protected _positions: Position[];
    protected _maxQuantity: number;
    protected _availableQuantity: number;
    protected _backtestResult: BacktestResult | null;
    protected _indicatorFns: Map<string, IndicatorFn> = new Map();
    protected _indicators: StrategyIndicators = {};

    constructor(candles: Candle[], capital: Money, maxQuantity: number){
        this._candles = candles;
        this._capital = capital;
        this._positions = [];
        this._maxQuantity = maxQuantity;
        this._availableQuantity = maxQuantity;
        this._backtestResult = null;
    }

    protected abstract setup(): void;

    protected abstract run(): void;

    public abstract get params(): TParams;

    public abstract permutations(candles: Candle[],
        capital: Money,
        ranges: Partial<Record<keyof TParams, unknown[]>>): Strategy<TParams>[];

    public execute(): BacktestResult{
        this.setup();
        this.run();
        return this._backtestResult = this.results();
    }

    protected addIndicator(name: string, fn: IndicatorFn): void{
        this._indicatorFns.set(name, fn);
        this._indicators[name] = fn(this._candles);
    }

    public getIndicators(): StrategyIndicators {
        return this._indicators;
    }

    protected openPosition(direction: Direction, entry: Candle, quantity: number): void{
        if(quantity > this._availableQuantity) quantity = this._availableQuantity;

        const ppu = new Money(entry.close);
        if(ppu.greaterThan(this._capital)) return

        const affordableQuantity = Math.floor(this._capital.toDecimal() / entry.close);
        quantity = Math.min(quantity, affordableQuantity);

        const cost = ppu.multiply(quantity);
        this._capital = this._capital.subtract(cost);
        this._availableQuantity -= quantity;

        const position = direction === Direction.Long
            ? Position.buy(entry.close, new Date(entry.time), quantity)
            : Position.sell(entry.close, new Date(entry.time), quantity)

        this._positions.push(position);
    }

    protected closePosition(position: Position, exit: Candle): void{
        position.close(exit.close, new Date(exit.time));
        this._capital = this._capital.add(
            new Money(exit.close).multiply(position.quantity)
        );
        this._availableQuantity = Math.min(
            this._availableQuantity + position.quantity,
            this._maxQuantity
        )
    }

    protected results(): BacktestResult{
        const closed = this._positions.filter(p => p.isClosed);
        const winners = closed.filter(p=> p.profit > 0);

        const totalProfit = Money.fromDecimal(Position.sum(closed));
        const endingCapital =  this._capital.add(totalProfit);

        return {
            startingCapital: this._capital,
            endingCapital: endingCapital,
            positions: this._positions,
            totalTrades: closed.length,
            winningTrades: winners.length,
            losingTrades: closed.length - winners.length,
            winRate: closed.length > 0 ? winners.length / closed.length : 0,
            totalReturn: endingCapital.subtract(this._capital).toDecimal() / this._capital.toDecimal(),
        }
    }

    public get isExecuted(): boolean {
        if (!this._backtestResult) {
            return false
        } else {
            return true;
        }
    }

    public get getResult(): BacktestResult | null{
        return this._backtestResult;
    }

}
