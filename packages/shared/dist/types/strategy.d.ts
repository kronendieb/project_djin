import { Candle } from "./candles";
import { Money } from "./money";
import { Position } from "./invest";
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
export declare abstract class Strategy {
    private _candles;
    private _capital;
    private _positions;
    private _maxQuantity;
    private _backtestResult;
    constructor(basis: Candle[], startingCapital: Money, maxQuantity: number);
    protected abstract setup(): void;
    protected abstract run(): void;
    protected results(): BacktestResult;
    execute(): BacktestResult;
    get isExecuted(): boolean;
    get getResult(): BacktestResult | null;
}
//# sourceMappingURL=strategy.d.ts.map