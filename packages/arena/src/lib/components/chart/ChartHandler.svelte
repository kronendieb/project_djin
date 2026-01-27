<script lang="ts">

import MouseControlOverlay from "./MouseControlOverlay.svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";
import { measure } from "../../scripts/ui/measure";

import { chartStore } from "../../scripts/stores/chartStore";
export let chartId = "";

export let width = 0;
export let height = 0;
export let data: Candle[] = [];

let svgElement: SVGSVGElement;

const onMouseMove = (e: MouseEvent) => {
    const rect = svgElement.getBoundingClientRect()
    const svgX = e.clientX - rect.left
    const svgY = e.clientY - rect.top

    chartStore.setHud(chartId, {x:svgX,y:svgY, hovered:true})
}

const onMouseLeave = () => {
    chartStore.clearHud(chartId)
}

const onResize = (e:any) => {
    ({width, height} = e.detail)
}

</script>


<div {...$$props} class="chart" 
    use:measure
    on:resize={onResize}
    on:mousemove={onMouseMove}
    on:mouseleave={onMouseLeave}
    role="img"
>
    <svg bind:this={svgElement}
        width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Candlestick"
    >
        <slot/>
            <CandleMarket data={data} height={height} width={width}></CandleMarket>
            <MarketAxisChart data={data} height={height} width={width}/>
            <MouseControlOverlay data={data} height={height} width={width} chartId={chartId}/>
    </svg>
</div>

<style>
.chart{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-surface);
    width: 100%;
    height: 100%;
}
</style>
