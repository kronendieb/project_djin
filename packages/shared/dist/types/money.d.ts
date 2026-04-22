import { type Dinero } from "dinero.js";
import { USD } from "dinero.js";
export interface MoneyInput {
    amount: number;
    currency: typeof USD;
}
export interface MoneyJSON {
    amount: number;
    currency: string;
}
export declare class Money {
    private readonly _d;
    constructor(input: MoneyInput | Dinero<number> | number);
    static fromCents(cents: number, currency?: {
        readonly code: "USD";
        readonly base: 10;
        readonly exponent: 2;
    }): Money;
    static fromDecimal(value: number, currency?: {
        readonly code: "USD";
        readonly base: 10;
        readonly exponent: 2;
    }): Money;
    static fromJSON(json: MoneyJSON): Money;
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    equals(other: Money): boolean;
    greaterThan(other: Money): boolean;
    lessThan(other: Money): boolean;
    format(locale?: string): string;
    toJSON(): MoneyJSON;
    toDecimal(): number;
    toDinero(): Dinero<number>;
}
//# sourceMappingURL=money.d.ts.map