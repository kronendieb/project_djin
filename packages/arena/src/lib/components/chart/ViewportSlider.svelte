<script lang="ts">
import { chartStore } from "../../scripts/stores/chartStore";

let {
chartId,width
}:{
    chartId:string
    width:number,
} = $props();

let candles = $derived($chartStore[chartId]?.data.candles)
let viewport = $derived($chartStore[chartId]?.viewport);
let hud = $derived($chartStore[chartId]?.hud);

let leftPos = $derived((viewport.start/candles.length) * 100);
let widthPos = $derived((Math.min(viewport.count, candles.length - viewport.start)/candles.length) * 100);

let isHoveringSlider = $state(false);

let dragStartX: number | null = null;
let dragStartViewportStart: number | null = null;

function onMouseDown(e:MouseEvent){
    if(!isHoveringSlider) return;
    dragStartX =  hud.x;
    dragStartViewportStart = viewport.start
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(){
    if(dragStartX === null || dragStartViewportStart === null) return;
    const pixelDelta = hud.x - dragStartX;
    const candleDelta = Math.round((pixelDelta / width) * candles.length);
    const newStart = Math.max(0, Math.min(
        dragStartViewportStart + candleDelta,
        candles.length - viewport.count
    ));
    chartStore.setViewport(chartId, {start: newStart, count: viewport.count});
}

function onMouseUp(){
    dragStartX = null;
    dragStartViewportStart = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
}

</script>

<div
    class="sliderBase"
>
    <div class="slider"
        class:active={isHoveringSlider}
        style:left="{leftPos}%"
        style:width="{widthPos}%"
        onmouseenter={() => isHoveringSlider = true}
        onmouseleave={() => isHoveringSlider = false}
        onmousedown={onMouseDown}
        role="slider"
        tabindex="0"
        aria-valuenow={viewport.start}
        aria-valuemin={0}
        aria-valuemax={candles.length - viewport.count}
    >
        <div class="sliderShadow">

        </div>
    </div>
</div>

<style>
.sliderBase{
    height: 100%;
    z-index: 10;
}
.slider{
    height: 100%;
    position: absolute;
}
.slider.active{
    cursor: pointer;
}
.sliderShadow{
    background: var(--color-over-surface);
    width: 100%;
    height: 100%;
}
</style>
