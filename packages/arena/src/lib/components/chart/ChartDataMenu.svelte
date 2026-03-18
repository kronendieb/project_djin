<script lang="ts">

import type { ChartMenuProperties } from "../../scripts/chart/chartMenuProperties";
import { FrequencyTypes, PeriodTypes, PeriodToFrequencyTypes } from "@tzar/shared";
import { chartStore } from "../../scripts/stores/chartStore";
import { untrack } from "svelte";

let {onClose, onSubmit, chartId}:
{
    onClose:()=>void,
    onSubmit:(values:ChartMenuProperties)=>void,
    chartId: string,
}= $props();

$effect.pre(()=> {
    chartStore.initChart(chartId);
})

let chartParams = $state($chartStore[chartId].data.params);
$effect(() => {
    chartId;
    chartParams = untrack(() => $chartStore[chartId].data.params);
})

function stop(e: MouseEvent){
    e.stopPropagation();
}
function submit(){
    onSubmit({id:chartId, params: chartParams});
}

const availablePeriods = $derived(chartParams.periodType ?
    PeriodTypes[chartParams.periodType] : []);

const availableFrequencyTypes = $derived(chartParams.periodType ?
    PeriodToFrequencyTypes[chartParams.periodType] : []);

const availableFrequencies = $derived(chartParams.frequencyType ? 
    FrequencyTypes[chartParams.frequencyType]: []);

</script>

<div class="overlay" onpointerdown={onClose}>
    <div class="menu" onpointerdown={stop} >

        <label for="title">
            <span>Title</span>
            <input type="text" bind:value={chartId}/>
        </label>

        <label for="symbol">
            <span>Symbol</span>
            <input type="text" bind:value={chartParams.symbol}/>
        </label>

        <label for="periodType">
            <span> Period Type </span>
            <select bind:value={chartParams.periodType}>
                <option value="">-- Select a period type --</option>
                {#each Object.keys(PeriodTypes) as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </label>

        <label for="period">Period
            <select bind:value={chartParams.period} disabled={!chartParams.periodType}>
                <option value="">-- Select a period --</option>
                {#each availablePeriods as periods}
                    <option value={periods}>{periods}</option>
                {/each}
            </select>
        </label>


        <label for="frequencyType">Frequency Type
            <select bind:value={chartParams.frequencyType}>
                <option value="">-- Select a frequency type --</option>
                {#each availableFrequencyTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </label>

        <label for="frequency">Frequency
            <select bind:value={chartParams.frequency}>
                <option value="">-- Select a frequency --</option>
                {#each availableFrequencies as freq}
                    <option value={freq}>{freq}</option>
                {/each}
            </select>
        </label>

        <div>
            <button onpointerdown={submit}>Apply</button>
            <button onpointerdown={onClose}>Close</button>
        </div>
    </div>
</div>

<style>

.overlay {
    position: absolute;
    background-color: rgb(from var(--color-bg) r g b / 0.8);
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.menu {
    background:var(--color-bg);
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.menu label {
    display:flex;
    flex-direction: row;
    gap: 10px;
}
.menu label span{
    text-align: right;
    flex-shrink: 0;
}
.menu label input,
.menu label select{
    flex:1;
    max-width: 24em;
}
</style>
