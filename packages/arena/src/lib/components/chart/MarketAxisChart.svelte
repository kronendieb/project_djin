<script lang="ts">
import { chartStore } from "../../scripts/stores/chartStore";

let {
    data = [],
    chartId,
    width = 600,
    height = 300,
    lineColor = "white",
    dashColor = "#ffffff80",
    xticks = 6,
    yticks = 5,
}:{
    data?: Candle[],
    chartId: string,
    width: number,
    height: number,
    lineColor?: string,
    dashColor?: string,
    xticks?: number,
    yticks?: number,
} = $props();

let textOffset = 20;

const viewport = $derived($chartStore[chartId].viewport);
const candles = $derived(data.slice(viewport.start, viewport.start + viewport.count));

const max = $derived(Math.max(...candles.map(d => d.high)));
const min = $derived(Math.max(...candles.map(d => d.low)));

const xScale = (data: Candle[], time:number,  width:number) => {
    const t0 = data[0].time;
    const t1 = data[data.length - 1].time;
    return ((time - t0) / (t1 - t0)) * width;
}

const getXTicks = (data: Candle[], width:number, ticks:number) => {
    if(!data || data.length === 0){
        return [];
    }

    return Array.from({length: ticks}, (_, i) => {
        const idx = Math.floor((i / (ticks - 1)) * (data.length - 1));

        return {
            x: xScale(data, data[idx].time, width),
            label: new Date(data[idx].time).toLocaleDateString()
        }
    })
}

const yScale = (price:number, height:number, min:number, max:number) => {
    return height - ((price - min)/(max-min)) * height;
}

const getYTicks = (data: Candle[], height:number, min:number, max:number, ticks:number) => {
    if (!data || data.length === 0){
        return []
    }

    return Array.from({length: ticks}, (_, i) => {
        const value = min + (i / (ticks - 1)) * (max - min)

        return {
            y: yScale(value, height, min, max),
            label: value.toFixed(2)
        }
    })

}

const xTicks = $derived(getXTicks(candles, width, xticks));
const yTicks = $derived(getYTicks(candles, height, min, max, yticks));

</script>


<g>

    {#each xTicks as t}
        <line
            x1={t.x}
            x2={t.x}
            y1={0}
            y2={height}
            stroke={dashColor}
            stroke-dasharray="5,20"
        ></line>
        <text 
            x={t.x}
            y={textOffset}
            font-size="10"
            fill="#aaa"
            text-anchor="end"
            dominant-baseline="middle"
            transform={`rotate(-90 ${t.x + 10} ${textOffset})`}
        >{t.label}</text>
    {/each}

    {#each yTicks as t}
        <line
            x1={0}
            x2={width}
            y1={t.y}
            y2={t.y}
            stroke={dashColor}
            stroke-dasharray="5,10"
        ></line>
        <text 
            x={4}
            y={t.y - 2}
            font-size="10"
            fill="#aaa"
            text-anchor="start"
        >{t.label}</text>
    {/each}

    <line
        x1={0}
        y1={0}
        x2={0}
        y2={height}
        stroke={lineColor}
    ></line>
    <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke={lineColor}
    ></line>

</g>
