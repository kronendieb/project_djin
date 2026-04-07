<script lang="ts">
import { candleWidth, yScale } from "../../scripts/chart/scales";
import { chartStore } from "../../scripts/stores/chartStore";
import type { Candle } from "@tzar/shared";

let {width, height, lineColor="white", chartId}:
{
    width: number,
    height: number,
    lineColor?: string,
    chartId: string
} = $props();

const viewport = $derived($chartStore[chartId]?.viewport);
const candles = $derived($chartStore[chartId]?.data.candles.slice(viewport.start, viewport.start + viewport.count));
const thickness = $derived( candleWidth(width, viewport.count));
const candleIndex = $derived(Math.floor(
    ($chartStore[chartId]?.hud.x / width) * viewport.count
));
const snappedX = $derived(
    Math.floor(($chartStore[chartId]?.hud.x / width) * viewport.count) * thickness + thickness / 2
);
const mouseY = $derived($chartStore[chartId]?.hud.y);
const time = $derived(new Date(candles[candleIndex]?.time).toLocaleDateString());
const candleHovered = $derived(candles[candleIndex]);
const flipped = $derived(snappedX > width / 2);

const min = $derived( Math.min(... candles.map(d => d.low)));
const max = $derived(Math.max(... candles.map(d => d.high)));

const priceAtMouse = $derived(max - (mouseY / height) * (max - min));

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<g>
    {#if $chartStore[chartId]?.hud.hovered}
        <line
            x1={snappedX}
            x2={snappedX}
            y1={0}
            y2={height}
            stroke="var(--color-text-light)"
            stroke-width="0.5px"
        ></line>
        <line
            x1={0}
            x2={width}
            y1={mouseY}
            y2={mouseY}
            stroke="var(--color-text-light)"
            stroke-width="0.5px"
        ></line>
        <g  class="gui"
            class:flip={flipped}>
            <text
                x={snappedX}
                y={mouseY - 4}
                font-size="10"
                fill="var(--color-text)"
            >{time}</text>
            <text
                x={snappedX}
                y={mouseY - 32}
                font-size="10"
                fill="var(--color-text)"
            >{priceAtMouse.toFixed(2)}</text>
            <text
                x={snappedX}
                y={mouseY - 18}
                font-size="10"
                fill="var(--color-text)"
            >C: {candleHovered?.close}</text>
        </g>
    {/if}
</g>

<style>
.gui {
    white-space:nowrap;
    transform: translateX(10px);
}
.gui.flip{
    transform: translateX(calc(-5em));
}

</style>

