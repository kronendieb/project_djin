import { writable } from "svelte/store";
import { Candle } from "packages/shared/src/types/candles";

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
    data: Candle[]
}

export type ChartState = {
    viewport: Viewport
    hud: HudState
    data: ChartData
}

const initHud = {
    x: 0,
    y: 0,
    hovered: false,
}

const initData = {
    data: [],
}

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

    setChartData(id: ChartId, data: ChartState["data"]){
        charts.update(state => {
            ensureChart(state, id)
            state[id].data = data
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
