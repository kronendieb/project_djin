<script lang="ts">
import {onMount} from "svelte";
import ChartHandler from "./ChartHandler.svelte";

let data: Candle[] = $state([]);
let symbol: string = "AAPL";

let container: HTMLElement;
let chartCount = 4;

let error:string = $state("");
const getMarketData = async () => {
    try{
        const res = await fetch(`/api/marketdata/price-history/${symbol}`);
        const body = await res.json();

        if(!res.ok){
            throw new Error(body?.error ?? "Unknown Server Error");
        }

        data = body;
    } catch (err: any){
        error = err.message;
    }
};

$inspect(error)
$inspect(data)

onMount(async () => {
    getMarketData();
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
