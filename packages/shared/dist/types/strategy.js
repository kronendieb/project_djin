import { Money } from "./money";
import { Position } from "./invest";
export class Strategy {
    _candles;
    _capital;
    _positions;
    _maxQuantity;
    _backtestResult;
    constructor(basis, startingCapital, maxQuantity) {
        this._candles = basis;
        this._capital = startingCapital;
        this._positions = [];
        this._maxQuantity = maxQuantity;
        this._backtestResult = null;
    }
    results() {
        const closed = this._positions.filter(p => p.isClosed);
        const winners = closed.filter(p => p.profit > 0);
        const endingCapital = Money.fromDecimal(Position.sum(closed));
        return {
            startingCapital: this._capital,
            endingCapital: endingCapital,
            positions: this._positions,
            totalTrades: closed.length,
            winningTrades: winners.length,
            losingTrades: closed.length - winners.length,
            winRate: closed.length > 0 ? winners.length / closed.length : 0,
            totalReturn: endingCapital.subtract(this._capital).toDecimal() / this._capital.toDecimal(),
        };
    }
    execute() {
        this.setup();
        this.run();
        return this._backtestResult = this.results();
    }
    get isExecuted() {
        if (!this._backtestResult) {
            return false;
        }
        else {
            return true;
        }
    }
    get getResult() {
        return this._backtestResult;
    }
}
