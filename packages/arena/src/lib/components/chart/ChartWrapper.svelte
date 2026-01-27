<script lang="ts">
import {onMount} from "svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import CloseMarketChart from "./CloseMarketChart.svelte";
import SimpleMovingAverageChart from "./SimpleMovingAverageChart.svelte";
import MouseControlOverlay from "./MouseControlOverlay.svelte";
import ChartHandler from "./ChartHandler.svelte";

let data: Candle[] = [];
let symbol: string = "AAPL";

let width = 1500;
let height = 800;

let container: HTMLElement;
let chartCount = 0;

let error:any = null;
const getMarketData = async () => {
    try{
        const fetchData = await fetch(`/api/marketdata/price-history/${symbol}`)
        data = await fetchData.json();
    } catch (err: any){
        error = err.mesage;
    }
};

onMount(async () => {
    getMarketData();
    chartCount = container.children.length;
})

$: chartColumns = Math.ceil(Math.sqrt(chartCount));

</script>

<div class="wrapper" bind:this={container}
    style="grid-template-columns: repeat({chartColumns}, 1fr);"
>
    <!-- Current visible Charts overlayed -->
    <ChartHandler data={data} chartId={"1"}>
    </ChartHandler>

    <ChartHandler data={data} chartId={"1"}>
    </ChartHandler>

    <ChartHandler data={data} chartId={"1"}>
    </ChartHandler>

    <!-- Hidden Charts 
    <ChartHandler data={data} width={width} height={height} chartId={"1"}>
            <CandleMarket data={data} height={height} width={width}></CandleMarket>
            <MarketAxisChart data={data} height={height} width={width}/>
    </ChartHandler>

        <SimpleMovingAverageChart data={data} height={height} width={width} period={10}/>
        <SimpleMovingAverageChart data={data} height={height} width={width} period={20} lineColor={"cyan"}/>

    <div class="chart" style={`width: ${width}px; height: ${height}px`}>
        <CandleMarket data={data} height={height} width={width}></CandleMarket>
        <CloseMarketChart data={data} height={height} width={width}/>
        <MarketAxisChart data={data} height={height} width={width} lineColor={"#ffffff"}/>
        <MouseControlOverlay data={data} height={height} width={width}/>
    </div>


    -->
</div>

<style>

.wrapper {
    background-color: var(--color-bg);
    display: grid;
    grid-auto-rows: 1fr;
    gap: 5px;
    width: 100%;
    height: 100%;
}

</style>
