<script lang="ts">
import type { Snippet } from "svelte";

import MouseControlOverlay from "./MouseControlOverlay.svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";
import ChartDataMenu from "./ChartDataMenu.svelte";
import ChartMenu from "./ChartMenu.svelte";
import ViewportSlider from "./ViewportSlider.svelte";
import SimpleMovingAverageChart from "./SimpleMovingAverageChart.svelte";

import { useResize } from "../../scripts/ui/useResize";
import { chartStore } from "../../scripts/stores/chartStore";
import { fetchMarketData } from "../../scripts/chart/marketFetch";
import type { ChartMenuProperties } from "../../scripts/chart/chartMenuProperties";

let {
    chartId,
    width=0,
    height=0,
    children
}:{
    chartId:string,
    width?: number,
    height?: number,
    children?: Snippet,
} = $props();

const chart = $derived($chartStore[chartId]);
const candles = $derived($chartStore[chartId].data.candles)
const marketParams = $derived(chart.data.params);

let error = $state("");
$effect.pre(() => {
    chartStore.initChart(chartId);
});
$effect(() => {
    if(candles.length < 1){
        fetchMarketData(marketParams).then((d) => {
            chartStore.setChartData(chartId, {
                candles: d,
                params: marketParams,
            })
        }).catch((err) => {error = err.message})
    }
    console.log(`${chartId} updated their data`);
});

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

const onResize = (rect: DOMRectReadOnly) => {
    width = rect.width;
    height = rect.height;
}

let menuOpen = $state(false);

const openMenu = (e:MouseEvent) => {
    if (e.button !== 1) return;
    menuOpen = true;
    e.preventDefault();
}

</script>

<div class="chart" 
    use:useResize={onResize}
    onmousemove={onMouseMove}
    onmouseleave={onMouseLeave}
    onpointerdown={openMenu}
    role="img"
>
    <ViewportSlider chartId={chartId} width={width}></ViewportSlider>
    {#if menuOpen}
        <ChartMenu bind:chartId={chartId} onClose={()=>{menuOpen=false}}></ChartMenu>
    {/if}
    <svg bind:this={svgElement}
        width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Candlestick"
        pointer-events="none"
    >
        {@render children?.()}
        <MarketAxisChart height={height} width={width} chartId={chartId}/>
        <CandleMarket height={height} width={width} chartId={chartId}/>
        <MouseControlOverlay height={height} width={width} chartId={chartId}/>
        <SimpleMovingAverageChart height={height} width={width} chartId={chartId}/>
    </svg>
</div>

<style>

.chart{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-surface);
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.chart>svg{
    position:absolute;
    z-index: 10;
}

</style>
