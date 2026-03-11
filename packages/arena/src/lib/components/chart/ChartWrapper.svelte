<script lang="ts">
import {onMount} from "svelte";
import ChartHandler from "./ChartHandler.svelte";
import type { Candle } from "@tzar/shared";
import type { MarketParameters } from "@tzar/shared";
import { fetchMarketData } from "../../scripts/chart/marketFetch";

let data: Candle[] = $state([]);

let container: HTMLElement;
let chartCount = 4;

let error:string = $state("");
const props = {
    symbol: "AAPL",
    periodType: "year",
    period: "1",
    frequencyType: "daily",
    frequency: "1"
} as MarketParameters;

$effect.pre(() => {
    try{
        fetchMarketData(props).then((d) => {
            data  = d;
        }).catch((err)=> {error=err.message;});
    }catch (err: any){
        error = err.message;
    }
})

const chartColumns = $derived(Math.ceil(Math.sqrt(chartCount)));

</script>

<div class="wrapper" bind:this={container}
    style="grid-template-columns: repeat({chartColumns}, 1fr);"
>
    <!-- Current visible Charts overlayed -->
    {#each Array(chartCount) as _, i}
        <ChartHandler data={data} chartId={"1"}>
        </ChartHandler>
    {/each}

    <!-- Hidden Charts 
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
    padding: 5px;
}

</style>
