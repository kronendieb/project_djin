export declare enum Direction {
    Long = "long",
    Short = "short"
}
export declare namespace Direction {
    function fromString(value: string): Direction;
}
export interface PositionJSON {
    direction: Direction;
    entryPrice: number;
    exitPrice: number | null;
    entryDate: string;
    exitDate: string | null;
    quantity: number;
}
export declare class Position {
    private _entryPrice;
    private _exitPrice;
    private _quantity;
    private _entryDate;
    private _exitDate;
    private _direction;
    constructor(direction: Direction, entryPrice: number, entryDate: Date, quantity?: number);
    static buy(price: number, date: Date, quantity?: number): Position;
    static sell(price: number, date: Date, quantity?: number): Position;
    close(price: number, date: Date): void;
    get profit(): number;
    unrealized(marketPrice: number): number;
    get isClosed(): boolean;
    get isOpen(): boolean;
    get direction(): Direction;
    get entryPrice(): number;
    get exitPrice(): number | null;
    get quantity(): number;
    get openDate(): Date;
    get closeDate(): Date | null;
    static sum(positions: Position[]): number;
    static unrealizedSum(positions: Position[], marketPrice: number): number;
    toJSON(): PositionJSON;
    toString(): string;
    static fromJSON(json: PositionJSON): Position;
    static fromString(json: string): Position;
}
//# sourceMappingURL=invest.d.ts.map