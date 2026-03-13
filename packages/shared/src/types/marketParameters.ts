export type MarketParameters = {
    symbol: string
    periodType: string
    period: string
    frequencyType: string
    frequency: string
}

export const PeriodTypes:Record<string, string[]> = {
    "day": ["1", "2", "3", "4", "5", "10"],
    "month": ["1", "2", "3", "6"],
    "year": ["1", "2", "3", "5", "10", "15", "20"],
    "ytd": ["1"],
}

export const PeriodToFrequencyTypes:Record<string, string[]> = {
    "day": ["minute"],
    "month": ["daily", "weekly"],
    "year": ["daily", "weekly", "monthly"],
    "ytd": ["daily",  "weekly"],
}

export const FrequencyTypes:Record<string, string[]> = {
    "minute": ["1", "5", "10", "15", "30"],
    "daily": ["1"],
    "weekly": ["1"],
    "monthly": ["1"],
}
