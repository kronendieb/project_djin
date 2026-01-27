import { writable } from "svelte/store";

export type ChartId = string;

export type Viewport = {
    start: number
    end: number
}

export type HudState = {
    x: number
    y: number
    hovered: boolean
}

export type ChartState = {
    viewport: Viewport
    hud: HudState
}

const initHud = {
    x: 0,
    y: 0,
    hovered: false,
}

export const charts = writable<Record<ChartId, ChartState>>({})

const ensureChart = (state: Record<ChartId,ChartState>, id: ChartId) => {
    if(!state[id]){
        state[id] = {
            viewport: {start: 0, end: 0},
            hud: {...initHud}
        }
    }
}

export const chartStore = {
    subscribe: charts.subscribe,

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
