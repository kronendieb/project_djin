import { Candle, Money, Position, Direction } from "../types";
export type IndicatorFn = (candles: Candle[]) => IndicatorSeries;
export type IndicatorSeries = {
    type: 'line';
    values: number[];
} | {
    type: 'band';
    upper: number[];
    middle: number[];
    lower: number[];
} | {
    type: 'macd';
    macd: number[];
    signal: number[];
    histogram: number[];
} | {
    type: 'histogram';
    values: number[];
} | {
    type: 'signal';
    indices: number[];
    direction: Direction;
};
export interface StrategyIndicators {
    [key: string]: IndicatorSeries;
}
export interface BacktestResult {
    startingCapital: Money;
    endingCapital: Money;
    positions: Position[];
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalReturn: number;
}
export declare abstract class Strategy<TParams extends Record<string, unknown>> {
    protected _candles: Candle[];
    protected _capital: Money;
    protected _positions: Position[];
    protected _maxQuantity: number;
    protected _availableQuantity: number;
    protected _backtestResult: BacktestResult | null;
    protected _indicatorFns: Map<string, IndicatorFn>;
    protected _indicators: StrategyIndicators;
    constructor(candles: Candle[], capital: Money, maxQuantity: number);
    protected abstract setup(): void;
    protected abstract run(): void;
    abstract get params(): TParams;
    abstract permutations(candles: Candle[], capital: Money, ranges: Partial<Record<keyof TParams, unknown[]>>): Strategy<TParams>[];
    execute(): BacktestResult;
    protected addIndicator(name: string, fn: IndicatorFn): void;
    getIndicators(): StrategyIndicators;
    protected openPosition(direction: Direction, entry: Candle, quantity: number): void;
    protected closePosition(position: Position, exit: Candle): void;
    protected results(): BacktestResult;
    get isExecuted(): boolean;
    get getResult(): BacktestResult | null;
}
//# sourceMappingURL=strategy.d.ts.map