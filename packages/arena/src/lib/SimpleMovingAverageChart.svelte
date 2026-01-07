<script lang="ts">

export let data: Candle[] = [];
export let width = 600;
export let height = 300;
export let lineColor = "white";

export let period = 20;

$: min = Math.min(... data.map(d => d.low))
$: max = Math.max(... data.map(d => d.high))

const SMA = (data: Candle[]):(number | null)[] => {
    if(!data || data.length === 0) return [];

    const result: (number|null)[] = [];

    for (let i = 0; i < data.length; i++){
        if(i < period - 1){
            result.push(null);
            continue;
        }

        let sum = 0;
        for(let j = i - period + 1; j <= i; j++){
            sum += data[j].close
        }

        result.push(sum / period);
    }

    return result;
}

const xScale = (i: number) => {
    return (i / (data.length - 1)) * width;
}

const yScale = (price: number) => {
    return height - ((price - min) / (max - min)) * height
}

const SMAPath = (values: (number | null)[]):string => {
    if(!values || values.length === 0) return "";

    let d = "";

    values.forEach((value, i) => {
        if(value == null) return;
        if(i < period - 1) return;

        const x = xScale(i);
        const y = yScale(value);

        d += d === "" ? `M ${x} ${y}` : `L ${x} ${y}`;
    })

    return d;
}

$: path = SMAPath(SMA(data));

</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
    <path
        d={path}
        fill = "none"
        stroke = {lineColor}
        stroke-width = "1"
    ></path>
</svg>

<style>

</style>
