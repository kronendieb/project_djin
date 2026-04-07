<script lang="ts">

import { FrequencyTypes, PeriodTypes, PeriodToFrequencyTypes } from "@tzar/shared";
import { chartStore } from "../../scripts/stores/chartStore";
import { untrack } from "svelte";
import { fetchMarketData } from "../../scripts/chart/marketFetch";

let {onClose, chartId = $bindable()}:
{
    onClose:()=>void,
    chartId: string,
}= $props();

let menuId = $state(chartId);
$effect.pre(()=> {
    chartStore.initChart(chartId);
})

let chartParams = $state($chartStore[chartId].data.params);
$effect(() => {
    chartId = menuId;
    chartParams = untrack(() => $chartStore[chartId].data.params);
})

let error = $state("");
function submit(){
    chartId = menuId;
    fetchMarketData(chartParams).then((d) => {
        chartStore.setChartData(chartId, {
            candles: d,
            params: chartParams,
        })
    }).catch((err) => {error = err.message});
    onClose();
}
$inspect(error);

const availablePeriods = $derived(chartParams.periodType ?
    PeriodTypes[chartParams.periodType] : []);

const availableFrequencyTypes = $derived(chartParams.periodType ?
    PeriodToFrequencyTypes[chartParams.periodType] : []);

const availableFrequencies = $derived(chartParams.frequencyType ? 
    FrequencyTypes[chartParams.frequencyType]: []);

</script>

<div class="menu" >

    <label for="title">
        Title
    </label>
    <input type="text" bind:value={menuId}/>

    <label for="symbol">
        Symbol
    </label>
    <input type="text" bind:value={chartParams.symbol}/>

    <label for="periodType">
        Period Type
    </label>
    <select bind:value={chartParams.periodType}>
        {#each Object.keys(PeriodTypes) as type}
            <option value={type}>{type}</option>
        {/each}
    </select>

    <label for="period">Period
    </label>
    <select bind:value={chartParams.period} disabled={!chartParams.periodType}>
        {#each availablePeriods as periods}
            <option value={periods}>{periods}</option>
        {/each}
    </select>


    <label for="frequencyType">Frequency Type
    </label>
    <select bind:value={chartParams.frequencyType}>
        {#each availableFrequencyTypes as type}
            <option value={type}>{type}</option>
        {/each}
    </select>

    <label for="frequency">Frequency
    </label>
    <select bind:value={chartParams.frequency}>
        {#each availableFrequencies as freq}
            <option value={freq}>{freq}</option>
        {/each}
    </select>

    <div class="subButtons">
        <button onpointerdown={submit}>Apply</button>
        <button onpointerdown={onClose}>Close</button>
    </div>
</div>

<style>

.menu {
    background:var(--color-bg);
    padding: 1rem;
    border-radius: 8px;
    display: grid;
    gap: 5px 10px;
    grid-template-columns: auto 1fr;
    align-items: center;
}

.menu label{
    text-align: right;
    align-items: right;
}

.menu .subButtons{
    grid-column: 1/-1;
}

</style>
