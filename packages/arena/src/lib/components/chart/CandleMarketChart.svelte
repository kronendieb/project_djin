<script lang="ts">
    import { yScale, zoomAt, candleWidth } from "../../scripts/chart/scales";
    import { viewport } from "../../scripts/stores/chartViewport";

    export let data: Candle[] = [];
    export let width = 600;
    export let height = 300;

    $: candles = data.slice($viewport.start, $viewport.start + $viewport.count);
    $: candleThickness = candleWidth(width, $viewport.count);
    $: min = Math.min(...candles.map(d => d.low))
    $: max = Math.max(...candles.map(d => d.high))

    const y = (p: number) => {
        return yScale(p, min, max, height);
    }

    function onWheel(e: WheelEvent){
        e.preventDefault();

        viewport.update(v => 
            zoomAt(
                v,
                e.offsetX,
                width,
                e.deltaY < 0 ? 0.9 : 1.1,
                10,
                data.length
            )
        );
    }

    
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`} on:wheel={onWheel}>
    {#each data as c, i}
        {@const x = i * candleThickness + candleThickness / 2}
        {@const bullish = c.close >= c.open}

        <line
            x1={x}
            x2={x}
            y1={y(c.high)}
            y2={y(c.low)}
            stroke={bullish ? "green" : "red"}
            stroke-width="1"
        ></line>
        <rect
            x={x - candleThickness * 0.3}
            width = {candleThickness * 0.6}
            y={y(Math.max(c.open, c.close))}
            height={Math.max(1, Math.abs(y(c.open) - y(c.close)))}
            fill={bullish ? "green" : "red"}
        ></rect>
    {/each}
</svg>
