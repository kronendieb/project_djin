<script lang="ts">
export let data: Candle[] = [];
export let width = 600;
export let height = 300;
export let lineColor = "white";
export let dashColor = "#ffffff80";

let textOffset = 20;

$: max = Math.max(...data.map(d => d.high))
$: min = Math.max(...data.map(d => d.low))

const xScale = (time:number, data: Candle[]) => {
    const t0 = data[0].time;
    const t1 = data[data.length - 1].time;
    return ((time - t0) / (t1 - t0)) * width;
}

const getXTicks = (data: Candle[]) => {
    if(!data || data.length === 0){
        return [];
    }

    const ticks = 6;

    return Array.from({length: ticks}, (_, i) => {
        const idx = Math.floor((i / (ticks - 1)) * (data.length - 1));

        return {
            x: xScale(data[idx].time, data),
            label: new Date(data[idx].time).toLocaleDateString()
        }
    })
}

$: xTicks = getXTicks(data);

const yScale = (price:number) => {
    return height - ((price - min)/(max-min)) * height;
}

const getYTicks = (data: Candle[]) => {
    if (!data || data.length === 0){
        return []
    }

    const ticks = 5;

    return Array.from({length: ticks}, (_, i) => {
        const value = min + (i / (ticks - 1)) * (max - min)

        return {
            y: yScale(value),
            label: value.toFixed(2)
        }
    })

}

$: yTicks = getYTicks(data);

</script>

    
<g>

    {#each xTicks as t}
        <line
            x1={t.x}
            x2={t.x}
            y1={0}
            y2={height}
            stroke={dashColor}
            stroke-dasharray="5,20"
        ></line>
        <text 
            x={t.x}
            y={textOffset}
            font-size="10"
            fill="#aaa"
            text-anchor="end"
            dominant-baseline="middle"
            transform={`rotate(-90 ${t.x + 10} ${textOffset})`}
        >{t.label}</text>
    {/each}

    {#each yTicks as t}
        <line
            x1={0}
            x2={width}
            y1={t.y}
            y2={t.y}
            stroke={dashColor}
            stroke-dasharray="5,10"
        ></line>
        <text 
            x={4}
            y={t.y - 2}
            font-size="10"
            fill="#aaa"
            text-anchor="start"
        >{t.label}</text>
    {/each}

    <line
        x1={0}
        y1={0}
        x2={0}
        y2={height}
        stroke={lineColor}
    ></line>
    <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke={lineColor}
    ></line>

</g>
