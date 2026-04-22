import { Money, Position, Direction } from "../types";
export class Strategy {
    _candles;
    _capital;
    _positions;
    _maxQuantity;
    _availableQuantity;
    _backtestResult;
    _indicatorFns = new Map();
    _indicators = {};
    constructor(candles, capital, maxQuantity) {
        this._candles = candles;
        this._capital = capital;
        this._positions = [];
        this._maxQuantity = maxQuantity;
        this._availableQuantity = maxQuantity;
        this._backtestResult = null;
    }
    execute() {
        this.setup();
        this.run();
        return this._backtestResult = this.results();
    }
    addIndicator(name, fn) {
        this._indicatorFns.set(name, fn);
        this._indicators[name] = fn(this._candles);
    }
    getIndicators() {
        return this._indicators;
    }
    openPosition(direction, entry, quantity) {
        if (quantity > this._availableQuantity)
            quantity = this._availableQuantity;
        const ppu = new Money(entry.close);
        if (ppu.greaterThan(this._capital))
            return;
        const affordableQuantity = Math.floor(this._capital.toDecimal() / entry.close);
        quantity = Math.min(quantity, affordableQuantity);
        const cost = ppu.multiply(quantity);
        this._capital = this._capital.subtract(cost);
        this._availableQuantity -= quantity;
        const position = direction === Direction.Long
            ? Position.buy(entry.close, new Date(entry.time), quantity)
            : Position.sell(entry.close, new Date(entry.time), quantity);
        this._positions.push(position);
    }
    closePosition(position, exit) {
        position.close(exit.close, new Date(exit.time));
        this._capital = this._capital.add(new Money(exit.close).multiply(position.quantity));
        this._availableQuantity = Math.min(this._availableQuantity + position.quantity, this._maxQuantity);
    }
    results() {
        const closed = this._positions.filter(p => p.isClosed);
        const winners = closed.filter(p => p.profit > 0);
        const totalProfit = Money.fromDecimal(Position.sum(closed));
        const endingCapital = this._capital.add(totalProfit);
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
