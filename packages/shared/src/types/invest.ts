
export enum Direction  {
    Long = 'long',
    Short = 'short'
}

export namespace Direction{
    export function fromString(value: string): Direction{
        const match = Object.values(Direction).find(v => v === value);
        if(!match) throw new Error(`Invalid Direction: "${value}". Expected 'long' or 'short'`);
        return match as Direction;
    }
}

export interface PositionJSON{
    direction: Direction
    entryPrice: number
    exitPrice: number | null
    entryDate: string
    exitDate: string | null
    quantity: number
}

export class Position{
    private _entryPrice: number; // Price
    private _exitPrice: number | null; // Close

    private _quantity: number; // Quantity
    
    private _entryDate: Date;   // Date
    private _exitDate: Date | null;   // Date

    private _direction: Direction;

    constructor(direction: Direction, entryPrice: number, entryDate: Date, quantity: number = 1){
        this._direction = direction;
        this._entryPrice = entryPrice;
        this._quantity = quantity;
        this._entryDate = entryDate;
        this._exitPrice = null;
        this._exitDate = null;
    }

    static buy(price: number, date: Date, quantity = 1): Position{
        return new Position(Direction.Long, price, date, quantity);
    }

    static sell(price: number, date: Date, quantity = 1): Position{
        return new Position(Direction.Short, price, date, quantity);
    }

    close(price: number, date: Date){
        if (this.isClosed) throw new Error("Position Closed");
        this._exitPrice = price;
        this._exitDate = date;
    }

    get profit(): number{
        if (this._exitPrice === null) return 0;
        const raw = this._direction === Direction.Long
            ? this._exitPrice - this._entryPrice
            : this._entryPrice - this._exitPrice;
        return raw * this._quantity;
    }

    unrealized(marketPrice: number): number{
        if(this.isClosed) return this.profit;
        const raw = this._direction === Direction.Long
            ? marketPrice - this._entryPrice
            : this._entryPrice - marketPrice;
        return raw * this._quantity;
    }

    get isClosed(): boolean {return this._exitPrice !== null;}
    get isOpen(): boolean {return !this.isClosed;}
    get direction(): Direction {return this._direction;}
    get entryPrice(): number {return this._entryPrice;}
    get exitPrice(): number | null {return this._exitPrice;}
    get quantity(): number {return this._quantity;}
    get openDate(): Date {return this._entryDate;}
    get closeDate(): Date | null {return this._exitDate;}

    static sum(positions: Position[]): number {
        return positions.reduce((total, p) => total + p.profit, 0);
    }

    static unrealizedSum(positions: Position[], marketPrice: number): number{
        return positions
            .filter(p => p.isOpen)
            .reduce((total, p) => total + p.unrealized(marketPrice), 0);
    }

    toJSON(): PositionJSON{
        return{
            direction: this._direction,
            entryPrice: this._entryPrice,
            exitPrice: this._exitPrice ?? null,
            entryDate: this._entryDate.toISOString(),
            exitDate: this._exitDate?.toISOString() ?? null,
            quantity: this._quantity,
        }
    }

    toString(): string{
        return JSON.stringify(this.toJSON());
    }

    static fromJSON(json: PositionJSON): Position{
        const position = new Position(
            Direction.fromString(json.direction),
            json.entryPrice,
            new Date(json.entryDate),
            json.quantity
        );

        if(json.exitPrice !== null && json.exitDate !== null){
            position.close(json.exitPrice, new Date(json.exitDate));
        }

        return position;
    }

    static fromString(json: string): Position{
        return Position.fromJSON(JSON.parse(json) as PositionJSON);
    }

}
