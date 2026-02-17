<script lang="ts">
import type { Snippet } from "svelte";

import MouseControlOverlay from "./MouseControlOverlay.svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";
import ChartDataMenu from "./ChartDataMenu.svelte";
import { useResize } from "../../scripts/ui/useResize";

import { chartStore } from "../../scripts/stores/chartStore";

let {
    data = [],
    chartId,
    width=0,
    height=0,
    children
}:{
    data: Candle[],
    chartId:string,
    width?: number,
    height?: number,
    children?: Snippet,
} = $props();

let svgElement: SVGSVGElement;
chartStore.setViewport(chartId,{start:0, count: 100});

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
let menuValues = $state({
    title: "1",
});

const openMenu = (e:MouseEvent) => {
    if (e.button !== 1) return;
    menuOpen = true;
    e.preventDefault();
}
const closeMenu = () => {menuOpen = false;}
const handleSubmit = (values:any) => {
    menuValues = values;
    chartId = values.title;
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
        <ChartDataMenu onClose={closeMenu} bind:values={menuValues} onSubmit={handleSubmit}/>
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
