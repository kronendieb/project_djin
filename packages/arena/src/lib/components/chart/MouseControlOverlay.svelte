<script lang="ts">
import { candleWidth } from "../../scripts/chart/scales";
import { chartStore } from "../../scripts/stores/chartStore";

let {width, height, data, lineColor="white", chartId}:
{
    width: number,
    height: number,
    data: Candle[],
    lineColor?: string,
    chartId: string
} = $props();

const viewport = $derived($chartStore[chartId].viewport);
const candles = $derived(data.slice(viewport.start, viewport.start + viewport.count));
const thickness = $derived( candleWidth(width, viewport.count));
const candleIndex = $derived(Math.floor(
    viewport.start + ($chartStore[chartId]?.hud.x / width) * viewport.count
));
const snappedX = $derived(
    Math.floor(($chartStore[chartId]?.hud.x / width) * viewport.count) * thickness + thickness / 2
);
const time = $derived(new Date(candles[candleIndex]?.time).toLocaleDateString());

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<g>
    {#if $chartStore[chartId]?.hud.hovered}
        <line
            x1={snappedX}
            x2={snappedX}
            y1={0}
            y2={height}
            stroke={lineColor}
            stroke-width="1"
        ></line>
        <text
            x={snappedX}
            y={20}
            font-size="10"
            fill={lineColor}
        >{time}</text>
    {/if}
</g>

<style>

</style>

