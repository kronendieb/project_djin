import { get, writable } from "svelte/store";
import { PeriodTypes, Position, type Candle, type MarketParameters } from "@tzar/shared";
import { Money } from "@tzar/shared";

export type ChartId = string;

export type Viewport = {
    start: number
    count: number
}

export type HudState = {
    x: number
    y: number
    hovered: boolean
}

export type ChartData = {
    params: MarketParameters
    candles: Candle[]
}

export type StrategyData = {
    paper: Money
    positions: Position[]
    quantity: number
}

/*
 * The Chart store state type.
 * */
export type ChartState = {
    viewport: Viewport
    hud: HudState
    data: ChartData
}

const initHud:HudState = {
    x: 0,
    y: 0,
    hovered: false,
}

const initData:ChartData = {
    candles: [],
    params: {
        symbol: "$SPX",
        periodType: "year",
        period: "1",
        frequencyType: "daily",
        frequency: "1",
    }
};

export const charts = writable<Record<ChartId, ChartState>>({})

const ensureChart = (state: Record<ChartId,ChartState>, id: ChartId) => {
    if(!state[id]){
        state[id] = {
            viewport: {start: 0, count: 100},
            hud: {...initHud},
            data: {...initData},
        }
    }
}

export const chartStore = {
    subscribe: charts.subscribe,

    initChart(id: ChartId){
        charts.update(state =>  {
            ensureChart(state, id)
            return state
        })
    },

    setChartData(id: ChartId, data: ChartState["data"]){
        charts.update(state => {
            ensureChart(state, id)
            state[id].data = data

            const candleCount = data.candles.length;
            const currentViewport = state[id].viewport;

            state[id].viewport = {
                start: 0,
                count: Math.min(currentViewport.count, candleCount)
            }

            return state
        })
    },

    setViewport(id: ChartId, viewport: ChartState["viewport"]){
        charts.update(state => {
            ensureChart(state, id)
            state[id].viewport = viewport
            return state
        })
    },

    setHud(id: ChartId, hud: Partial<ChartState["hud"]>){
        charts.update(state => {
            ensureChart(state, id)
            state[id].hud = {...state[id].hud, ...hud}
            return state
        })
    },

    clearHud(id: ChartId){
        charts.update(state => {
            if(state[id]) state[id].hud = {...initHud}
            return state
        })
    }
}
