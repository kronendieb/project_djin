export var Direction;
(function (Direction) {
    Direction["Long"] = "long";
    Direction["Short"] = "short";
})(Direction || (Direction = {}));
(function (Direction) {
    function fromString(value) {
        const match = Object.values(Direction).find(v => v === value);
        if (!match)
            throw new Error(`Invalid Direction: "${value}". Expected 'long' or 'short'`);
        return match;
    }
    Direction.fromString = fromString;
})(Direction || (Direction = {}));
export class Position {
    _entryPrice; // Price
    _exitPrice; // Close
    _quantity; // Quantity
    _entryDate; // Date
    _exitDate; // Date
    _direction;
    constructor(direction, entryPrice, entryDate, quantity = 1) {
        this._direction = direction;
        this._entryPrice = entryPrice;
        this._quantity = quantity;
        this._entryDate = entryDate;
        this._exitPrice = null;
        this._exitDate = null;
    }
    static buy(price, date, quantity = 1) {
        return new Position(Direction.Long, price, date, quantity);
    }
    static sell(price, date, quantity = 1) {
        return new Position(Direction.Short, price, date, quantity);
    }
    close(price, date) {
        if (this.isClosed)
            throw new Error("Position Closed");
        this._exitPrice = price;
        this._exitDate = date;
    }
    get profit() {
        if (this._exitPrice === null)
            return 0;
        const raw = this._direction === Direction.Long
            ? this._exitPrice - this._entryPrice
            : this._entryPrice - this._exitPrice;
        return raw * this._quantity;
    }
    unrealized(marketPrice) {
        if (this.isClosed)
            return this.profit;
        const raw = this._direction === Direction.Long
            ? marketPrice - this._entryPrice
            : this._entryPrice - marketPrice;
        return raw * this._quantity;
    }
    get isClosed() { return this._exitPrice !== null; }
    get isOpen() { return !this.isClosed; }
    get direction() { return this._direction; }
    get entryPrice() { return this._entryPrice; }
    get exitPrice() { return this._exitPrice; }
    get quantity() { return this._quantity; }
    get openDate() { return this._entryDate; }
    get closeDate() { return this._exitDate; }
    static sum(positions) {
        return positions.reduce((total, p) => total + p.profit, 0);
    }
    static unrealizedSum(positions, marketPrice) {
        return positions
            .filter(p => p.isOpen)
            .reduce((total, p) => total + p.unrealized(marketPrice), 0);
    }
    toJSON() {
        return {
            direction: this._direction,
            entryPrice: this._entryPrice,
            exitPrice: this._exitPrice ?? null,
            entryDate: this._entryDate.toISOString(),
            exitDate: this._exitDate?.toISOString() ?? null,
            quantity: this._quantity,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    static fromJSON(json) {
        const position = new Position(Direction.fromString(json.direction), json.entryPrice, new Date(json.entryDate), json.quantity);
        if (json.exitPrice !== null && json.exitDate !== null) {
            position.close(json.exitPrice, new Date(json.exitDate));
        }
        return position;
    }
    static fromString(json) {
        return Position.fromJSON(JSON.parse(json));
    }
}
