<script lang="ts">

    export let data: Candle[] = [];
    export let width = 600;
    export let height = 300;

    $: min = Math.min(...data.map(d => d.low))
    $: max = Math.max(...data.map(d => d.high))
    $: range = max - min || 1;

    const y = (price: number) =>
        height * (1 - (price - min) / range)

    $: candleThickness = data.length > 0 ?
        width / data.length : 0;

</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
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
