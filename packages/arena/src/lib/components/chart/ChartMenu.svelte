<script lang="ts">
import ChartDataMenu from "./ChartDataMenu.svelte";

let {onClose, chartId = $bindable()}:
{
    onClose: ()=>void,
    chartId: string,
} = $props();

const stop = (e:MouseEvent) => {
    e.stopPropagation();
}

let activeTab = $state("chart");
const tabs = [
    {id:"chart", label:"Chart"},
    {id:"strategy", label:"Strategy"},
    {id:"account", label:"Account"}
]

</script>

<div class="overlay" onpointerdown={onClose}>
    <div class="tab-row" onpointerdown={stop}>
        {#each tabs as tab}
            <button
                class="tab"
                class:active={activeTab === tab.id}
                onpointerdown={() => activeTab = tab.id}
            >{tab.label}</button>
        {/each}
    </div>
    <div class="panel-box" onpointerdown={stop}>
        <div class="panel" class:active={activeTab === "chart"}>
            <ChartDataMenu onClose={onClose} bind:chartId={chartId} ></ChartDataMenu>
        </div>
    </div>
</div>

<style>

.overlay {
    position: absolute;
    background: color-mix(in srgb, var(--color-bg) 80%, transparent);
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.panel-box {
    background:var(--color-bg);
    padding: 1rem;
    border-radius: 8px;
    display: grid;
    align-items: center;
    border: var(--color-bg-light) solid 0.5px;
}

.panel-box > * {
    grid-area: 1/1;
}

/* -- Tabs -- */
.tab-row{
    display: flex;
    align-items: flext-end;
    justify-items: center;
    gap: 10px;
    padding: 0 12px;
    position: relative;
}

.tab {
    padding: 6px 16px;
    background: var(--color-bg-dark);
    border-radius: 6px 6px 0 0;
    border-bottom: none;
    border: var(--color-bg-light) solid 0.5px;
    color: var(--color-text);
    user-select: none;
    transition: background 0.1s, color 0.1s;
    margin-bottom: -1px;
}

.tab.active {
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-bg);
}

/* -- Panels --*/

.panel{
    visibility: hidden;
}

.panel.active{
    visibility: visible;
}

</style>
