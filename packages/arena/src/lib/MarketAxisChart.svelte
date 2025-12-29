<script lang="ts">
    export let width = 600;
    export let height = 300;
    export let padding = 20;
    export let lineColor = "white";
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
    <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke={lineColor}
    ></line>
    <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke={lineColor}
    ></line>
</svg>
