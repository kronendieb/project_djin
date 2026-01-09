<script lang="ts">
import { PathByValues } from "../../scripts/chart/Paths";
import { candleWidth, xScale, yScale } from "../../scripts/chart/scales";
import { viewport } from "../../scripts/stores/chartViewport";

export let data: Candle[] = [];
export let width = 600;
export let height = 300;
export let lineColor = "white";

$: candles = data.slice($viewport.start, $viewport.start + $viewport.count);
$: thickness = candleWidth(width, $viewport.count)
$: min = Math.min(...candles.map(d => d.low));
$: max = Math.max(...candles.map(d => d.high));
$: path = PathByValues(candles.map(d => d.close), x, y);

const x = (i:number) =>{
    return xScale(i, candles.length, width) + thickness / 2;
}

const y = (price:number) =>{
    return yScale(price, min, max, height);
}

</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
    <path 
        d={path}
        fill = "none"
        stroke = {lineColor}
        stroke-width = "1"
    />
</svg>
