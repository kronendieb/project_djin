<script lang="ts">
import type { Snippet } from "svelte";

import MouseControlOverlay from "./MouseControlOverlay.svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";
import ChartDataMenu from "./ChartDataMenu.svelte";

import { useResize } from "../../scripts/ui/useResize";
import type { Candle } from "@tzar/shared";
import type { MarketParameters } from "@tzar/shared";
import { chartStore } from "../../scripts/stores/chartStore";
import { fetchMarketData } from "../../scripts/chart/marketFetch";
import type { ChartMenuProperties } from "../../scripts/chart/chartMenuProperties";

// TODO: delete the data property an add it to the store.
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
const data = $derived($chartStore[chartId].data.candles)
const marketParams = $derived(chart.data.params);

let error = $state("");
$effect.pre(() => {
    chartStore.initChart(chartId);
    if(data.length < 1){
    fetchMarketData(marketParams).then((d) => {
        chartStore.setChartData(chartId, {
            candles: d,
            params: marketParams,
        })
    }).catch((err) => {error = err.message})
    }
    console.log(`${chartId} updated their data`);
});
$inspect(error);
$inspect(data);

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
const closeMenu = () => {menuOpen = false;}

// This is a callback handler from ChartDataMenu Submit is triggered.
const handleSubmit = (values:ChartMenuProperties) => {
    chartId = values.id;
    fetchMarketData(values.params).then((d) => {
        chartStore.setChartData(chartId, {
            candles: d,
            params: values.params,
        })
    }).catch((err) => {error = err.message});
    menuOpen = false;
}

</script>


<div class="chart" 
    use:useResize={onResize}
    onmousemove={onMouseMove}
    onmouseleave={onMouseLeave}
    onpointerdown={openMenu}
    role="img"
>
    {#if menuOpen}
        <ChartDataMenu chartId={chartId} onClose={closeMenu} onSubmit={handleSubmit}/>
    {/if}
    <svg bind:this={svgElement}
        width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Candlestick"
    >
        {@render children?.()}
        <CandleMarket data={data} height={height} width={width} chartId={chartId}></CandleMarket>
        <MarketAxisChart data={data} height={height} width={width} chartId={chartId}/>
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
.chart>svg{
    position:absolute;
}
</style>
