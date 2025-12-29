<script lang="ts">

    export let data: Candle[] = [];
    export let width = 600;
    export let height = 300;
    export let padding = 20;
    export let lineColor = "white";

    $: min = Math.min(...data.map(d => d.close));
    $: max = Math.max(...data.map(d => d.close));

    const x = (i:number) =>
        padding + (i / (data.length - 1)) * (width - padding * 2)

    const y = (price:number) =>{
        //let normal = (price - min) / (max - min)
        //return height - normal;
        return height - padding - ((price - min) / (max - min)) * (height - padding * 2);
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
    stroke-width = "2"
    />
</svg>
