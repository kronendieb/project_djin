<script lang="ts">
import { candleWidth } from "../../scripts/chart/scales";
import { viewport } from "../../scripts/stores/chartViewport";
import { chartStore } from "../../scripts/stores/chartStore";

export let width: number;
export let height: number;
export let data:Candle[] = [];
export let lineColor:string = "white";
export let chartId: string;

let showCrosshair = false;
let hovered: boolean = false;

$: candles = data.slice($viewport.start, $viewport.start + $viewport.count);
$: thickness = candleWidth(width, $viewport.count);
$: candleIndex = Math.floor(
    $viewport.start + ($chartStore[chartId]?.hud.x / width) * $viewport.count
)
$: snappedX = 
    Math.floor(($chartStore[chartId]?.hud.x / width) * $viewport.count) * thickness + thickness / 2;
$: time = new Date(candles[candleIndex]?.time).toLocaleDateString();

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
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

