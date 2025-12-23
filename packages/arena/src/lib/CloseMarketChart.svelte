<script lang="ts">
    import {onMount} from "svelte";

    export let data: Candle[] = [];
    export let width = 600;
    export let height = 300;
    export let padding = 20;
    export let backgroundColor = "white";
    export let symbol = "AAPL";

    let error:any = null;
    const getMarketData = async () => {
        try{
            const fetchData = await fetch(`/api/marketdata/price-history/${symbol}`)
            data = await fetchData.json();
        } catch (err: any){
            error = err.mesage;
        }
    };

    onMount(async () => {
        getMarketData();
    })

    const prices = () => data.map(d => d.close);

    $: min = Math.min(...prices());
    $: max = Math.max(...prices());

    const x = (i:number) =>
        padding + (i / (data.length - 1)) * (width - padding * 2)

    const y = (price:number) =>
        height - padding -
        ((price - min) / (max - min) * (height - padding * 2))

    $: path = data
        .map((d, i) => `${i===0 ? 'M' : 'L'} ${x(i)} ${y(d.close)}`)
        .join(' ');
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
    <g color={backgroundColor}>
        <rect width={width} height={height} fill="currentColor"/>
    </g>

    <path 
    d={path}
    fill = "none"
    stroke = "currentColor"
    stroke-width = "2"
    />
</svg>
<p>{path}</p>

{#if error}
    <p>Error retrieving market data</p>
{/if}
