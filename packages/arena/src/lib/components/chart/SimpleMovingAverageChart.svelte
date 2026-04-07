<script lang="ts">
import { candleWidth, xScale, yScale } from "../../scripts/chart/scales";
import { SMA } from "../../scripts/chart/SMA";
import { PathByValues } from "../../scripts/chart/Paths";
import { chartStore } from "../../scripts/stores/chartStore";

let {
    width, height, lineColor = "yellow", period = 15, chartId
}: {
    chartId:string,
    width:number,
    height:number,
    lineColor?:string,
    period?:number,
} = $props();

const x = (i: number) => {
    return xScale(i, candles.length, width) + thickness / 2;
}

const y = (price: number) => {
    return yScale(price, min, max, height);
}

const viewport = $derived($chartStore[chartId]?.viewport);
const candles = $derived($chartStore[chartId]?.data.candles.slice(viewport.start, viewport.start + viewport.count));
const thickness = $derived(candleWidth(width, viewport.count));
const min = $derived( Math.min(... candles.map(d => d.low)));
const max = $derived(Math.max(... candles.map(d => d.high)));
const sma = $derived(SMA($chartStore[chartId]?.data.candles, period));
const path = $derived(PathByValues(sma.slice(viewport.start, viewport.start + viewport.count), x, y));

</script>

<g>
    <path
        d={path}
        fill = "none"
        stroke = {lineColor}
        stroke-width = "1"
    ></path>
</g>


<style>

</style>
