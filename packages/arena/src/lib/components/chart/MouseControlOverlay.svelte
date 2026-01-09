<script lang="ts">
    import { candleWidth } from "../../scripts/chart/scales";


import { viewport } from "../../scripts/stores/chartViewport";

export let width: number;
export let height: number;
export let data:Candle[] = [];
export let lineColor:string = "white";
export let chartID: string;

let mouseX = 0;
let showCrosshair = false;
let hovered: boolean = false;

$: candles = data.slice($viewport.start, $viewport.start + $viewport.count);
$: thickness = candleWidth(width, $viewport.count);
$: candleIndex = Math.floor(
    $viewport.start + (mouseX / width) * $viewport.count
)
$: snappedX = Math.floor((mouseX / width) * $viewport.count) * thickness + thickness / 2;
$: time = new Date(candles[candleIndex]?.time).toLocaleDateString();

const onMouseEnter = () => {
    hovered = true;
}

const onMouseMove = (e: MouseEvent) => {
    if(!hovered) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX = e.clientX - rect.left
    showCrosshair = true;
}

const onMouseLeave = () => {
    hovered = false;
    showCrosshair = false;
}

</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}
    on:mouseenter={onMouseEnter}
    on:mousemove={onMouseMove}
    on:mouseleave={onMouseLeave}
    role="figure"
>
    {#if showCrosshair}
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
</svg>

<style>

</style>
