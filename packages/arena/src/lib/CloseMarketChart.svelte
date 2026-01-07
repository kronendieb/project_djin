<script lang="ts">

    export let data: Candle[] = [];
    export let width = 600;
    export let height = 300;
    export let lineColor = "white";

    $: min = Math.min(...data.map(d => d.low));
    $: max = Math.max(...data.map(d => d.high));

    const x = (i:number) =>
        (i / (data.length - 1)) * (width)

    const y = (price:number) =>{
        return height - ((price - min) / (max - min)) * (height);
    }

    $: path = data
        .map((d, i) => `${i===0 ? 'M' : 'L'} ${x(i)} ${y(d.close)}`)
        .join(' ');
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
    <path 
    d={path}
    fill = "none"
    stroke = {lineColor}
    stroke-width = "1"
    />
</svg>
