<script lang="ts">
import {onMount} from "svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import CloseMarketChart from "./CloseMarketChart.svelte";
import SimpleMovingAverageChart from "./SimpleMovingAverageChart.svelte";
import MouseControlOverlay from "./MouseControlOverlay.svelte";

let data: Candle[] = [];
let symbol: string = "AAPL";

let width = 1500;
let height = 800;

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
})

</script>

<div class="wrapper">
    <!-- Current visible Charts overlayed -->
    <div class="chart" style={`width: ${width}px; height: ${height}px`}>
        <CandleMarket data={data} height={height} width={width}></CandleMarket>
        <SimpleMovingAverageChart data={data} height={height} width={width} period={10}/>
        <SimpleMovingAverageChart data={data} height={height} width={width} period={20} lineColor={"cyan"}/>
        <MarketAxisChart data={data} height={height} width={width}/>
        <MouseControlOverlay data={data} height={height} width={width}/>
    </div>

    <div class="chart" style={`width: ${width}px; height: ${height}px`}>
        <CandleMarket data={data} height={height} width={width}></CandleMarket>
        <CloseMarketChart data={data} height={height} width={width}/>
        <MarketAxisChart data={data} height={height} width={width} lineColor={"#ffffff"}/>
        <MouseControlOverlay data={data} height={height} width={width}/>
    </div>

    <!-- Hidden Charts 

    -->
</div>

<style>

.wrapper {
    background-color: #242424;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.chart{
    position: relative;
    flex-wrap: wrap;
    background-color: #141D25;
    aspect-ratio: 16/9;
    width: 100%;
    height: 100%;
}

:global(.chart > svg) {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
}

</style>
