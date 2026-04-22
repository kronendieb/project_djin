import { dinero, add, subtract, multiply, equal, greaterThan, lessThan, type Dinero, toDecimal } from "dinero.js";
import { USD } from "dinero.js";

export interface MoneyInput{
    amount: number;
    currency: typeof USD;
}

export interface MoneyJSON{
    amount: number;
    currency: string;
}

export class Money{
    private readonly _d: Dinero<number>;

    constructor(input: MoneyInput | Dinero<number> | number){
        if(typeof input === 'number'){
            this._d = dinero({amount: Math.round(input * 10 ** USD.exponent), currency: USD});
        } else{
            this._d = 'amount' in input ?
                dinero({amount: input.amount, currency: input.currency ?? USD}) : input;
        }
    }

    static fromCents(cents: number, currency = USD): Money{
        return new Money({amount: cents, currency});
    }

    static fromDecimal(value:number, currency = USD): Money{
        const cents = Math.round(value * 10 ** currency.exponent);
        return new Money({amount: cents, currency});
    }

    static fromJSON(json: MoneyJSON): Money{
        if (json.currency !== 'USD'){
            throw new Error(`Unsupported Currency: ${json.currency}`);
        }
        return Money.fromCents(json.amount);
    }

    /*
     * Arithmetic operations
     * */

    add(other: Money): Money{
        return new Money(add(this._d, other._d));
    }

    subtract(other: Money): Money{
        return new Money(subtract(this._d, other._d));
    }

    multiply(factor: number): Money{
        return new Money(multiply(this._d, factor));
    }

    /*
     * Comparison operations
     * */

    equals(other: Money): boolean{
        return equal(this._d, other._d);
    }

    greaterThan(other: Money): boolean{
        return greaterThan(this._d, other._d);
    }

    lessThan(other: Money): boolean{
        return lessThan(this._d, other._d);
    }

    /*
     * Output operations
     * */

    format(locale = 'en-US'): string{
        const decimal = toDecimal(this._d);
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: USD.code,
        }).format(Number(decimal));
    }

    toJSON(): MoneyJSON{
        const snapshot = this._d.toJSON();
        return {
            amount: snapshot.amount,
            currency: snapshot.currency.code,
        };
    }

    toDecimal(): number{
        return Number(toDecimal(this._d));
    }

    toDinero(): Dinero<number> {
        return this._d;
    }
}
