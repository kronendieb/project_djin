import { dinero, add, subtract, multiply, equal, greaterThan, lessThan, toDecimal } from "dinero.js";
import { USD } from "dinero.js";
export class Money {
    _d;
    constructor(input) {
        if (typeof input === 'number') {
            this._d = dinero({ amount: Math.round(input * 10 ** USD.exponent), currency: USD });
        }
        else {
            this._d = 'amount' in input ?
                dinero({ amount: input.amount, currency: input.currency ?? USD }) : input;
        }
    }
    static fromCents(cents, currency = USD) {
        return new Money({ amount: cents, currency });
    }
    static fromDecimal(value, currency = USD) {
        const cents = Math.round(value * 10 ** currency.exponent);
        return new Money({ amount: cents, currency });
    }
    static fromJSON(json) {
        if (json.currency !== 'USD') {
            throw new Error(`Unsupported Currency: ${json.currency}`);
        }
        return Money.fromCents(json.amount);
    }
    /*
     * Arithmetic operations
     * */
    add(other) {
        return new Money(add(this._d, other._d));
    }
    subtract(other) {
        return new Money(subtract(this._d, other._d));
    }
    multiply(factor) {
        return new Money(multiply(this._d, factor));
    }
    /*
     * Comparison operations
     * */
    equals(other) {
        return equal(this._d, other._d);
    }
    greaterThan(other) {
        return greaterThan(this._d, other._d);
    }
    lessThan(other) {
        return lessThan(this._d, other._d);
    }
    /*
     * Output operations
     * */
    format(locale = 'en-US') {
        const decimal = toDecimal(this._d);
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: USD.code,
        }).format(Number(decimal));
    }
    toJSON() {
        const snapshot = this._d.toJSON();
        return {
            amount: snapshot.amount,
            currency: snapshot.currency.code,
        };
    }
    toDecimal() {
        return Number(toDecimal(this._d));
    }
    toDinero() {
        return this._d;
    }
}
