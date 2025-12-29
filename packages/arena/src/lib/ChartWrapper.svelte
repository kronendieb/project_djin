<script lang="ts">
import {onMount} from "svelte";
import CandleMarket from "./CandleMarketChart.svelte";
import CloseMarketChart from "./CloseMarketChart.svelte";
import MarketAxisChart from "./MarketAxisChart.svelte";

let data: Candle[] = [];
let symbol: string = "AAPL";

let width = 1200;
let height = 600;

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

<div class="chart"
    style={`width:${width}px; height:${height}px`}>
    <!-- Current visible Charts overlayed -->
    <CandleMarket data={data} height={height} width={width}></CandleMarket>
    <MarketAxisChart height={height} width={width} lineColor={"#ffffff"}/>

    <!-- Hidden Charts 
    -->
</div>

<div class="chart"
    style={`width:${width}px; height:${height}px`}>
    <MarketAxisChart width={width} height={height}/>
    <CloseMarketChart data={data} height={height} width={width}/>
</div>

<style>

.chart{
    position: relative;
    background-color: #141D25;
    border-radius: 8px;
    padding: 4px;
}

:global(.chart > svg) {
    position: absolute;
    inset: 0;
}

</style>
