<script lang="ts">
    import { yScale, zoomAt, candleWidth } from "../../scripts/chart/scales";
    import { chartStore } from "../../scripts/stores/chartStore";


    let {
        data = [],
        width = 600,
        height = 300,
        chartId,
    }:{
        data: Candle[],
        width: number,
        height: number,
        chartId: string,
    } = $props();

    const viewport = $derived($chartStore[chartId].viewport)
    const candles = $derived(data.slice(viewport.start, viewport.start + viewport.count));
    const candleThickness = $derived(candleWidth(width, viewport.count));
    const min = $derived(Math.min(...candles.map(d => d.low)));
    const max = $derived(Math.max(...candles.map(d => d.high)));

    const y = (p: number) => {
        return yScale(p, min, max, height);
    }

</script>

<g>
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
</g>
