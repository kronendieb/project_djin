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
let isHoveringRight = $state(false);
let isHoveringLeft = $state(false);

let dragStartX: number | null = null;
let dragStartViewportStart: number | null = null;
let dragStartViewportEnd: number | null = null;

/*
// This is the main viewport window used to go from left to right in the chart
*/

function onMouseDown(e:MouseEvent){
    if(!isHoveringSlider) return;
    dragStartX =  hud.x;
    dragStartViewportStart = viewport.start
    dragStartViewportEnd = viewport.start + viewport.count
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
    dragStartViewportEnd = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
}


/*
// This is the right side of the slider used for resizing towards the right
*/
function onRightResizeMouseDown(e:MouseEvent){
    dragStartX =  hud.x;
    dragStartViewportStart = viewport.start
    dragStartViewportEnd = viewport.start + viewport.count
    window.addEventListener("mousemove", onRightResize);
    window.addEventListener("mouseup", onRightResizeMouseUp);
}

function onRightResize(){
    if(dragStartX === null || dragStartViewportStart === null || dragStartViewportEnd === null) return;
    const pixelDelta = hud.x - dragStartX;
    const candleDelta = Math.round((pixelDelta / width) * candles.length);
    let newEnd = Math.max(dragStartViewportStart + 1, Math.min(
        dragStartViewportEnd + candleDelta,
        candles.length
    ))
    const newCount = newEnd - dragStartViewportStart;
    chartStore.setViewport(chartId, {start:dragStartViewportStart, count:newCount});
}


function onRightResizeMouseUp(){
    dragStartX = null;
    dragStartViewportStart = null;
    dragStartViewportEnd = null;
    window.removeEventListener("mousemove", onRightResize);
    window.removeEventListener("mouseup", onRightResizeMouseUp);
}

/*
// This is the left side of the slider used for resizing towards the left
*/

function onLeftResizeMouseDown(e:MouseEvent){
    dragStartX =  hud.x;
    dragStartViewportStart = viewport.start
    dragStartViewportEnd = viewport.start + viewport.count
    window.addEventListener("mousemove", onLeftResize);
    window.addEventListener("mouseup", onLeftResizeMouseUp);
}

function onLeftResize(){
    if(dragStartX === null || dragStartViewportStart === null || dragStartViewportEnd === null) return;
    const pixelDelta = hud.x - dragStartX;
    const candleDelta = Math.round((pixelDelta / width) * candles.length);
    const newStart = Math.max(0, Math.min(
        dragStartViewportStart + candleDelta,
        dragStartViewportEnd - 1
    ));
    const newCount = dragStartViewportEnd - newStart;
    chartStore.setViewport(chartId, {start:newStart, count:newCount});
}


function onLeftResizeMouseUp(){
    dragStartX = null;
    dragStartViewportStart = null;
    dragStartViewportEnd = null;
    window.removeEventListener("mousemove", onLeftResize);
    window.removeEventListener("mouseup", onLeftResizeMouseUp);
}
</script>

<div
    class="sliderBase"
>
    <div class="leftSlider"
        style:left="{leftPos}%"
        class:active={isHoveringLeft}
        onmouseenter={() => isHoveringLeft = true}
        onmouseleave={() => isHoveringLeft = false}
        onmousedown={onLeftResizeMouseDown}
        role="slider"
        tabindex="0"
        aria-valuenow={viewport.start}
        aria-valuemin={0}
        aria-valuemax={candles.length - viewport.count}
    >
    </div>
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
    </div>
    <div class="rightSlider"
        style:left="{leftPos + widthPos}%"
        class:active={isHoveringRight}
        onmouseenter={() => isHoveringRight = true}
        onmouseleave={() => isHoveringRight = false}
        onmousedown={onRightResizeMouseDown}
        role="slider"
        tabindex="0"
        aria-valuenow={viewport.start}
        aria-valuemin={0}
        aria-valuemax={candles.length - viewport.count}
    >
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
    background: color-mix(in srgb, var(--color-surface-light) 50%, transparent);
}
.slider.active{
    cursor: pointer;
}

.rightSlider{
    position: absolute;
    background: color-mix(in srgb, var(--color-surface-light) 80%, transparent);
    width: 0.5rem;
    height: 100%;
}
.rightSlider.active{
    cursor:pointer;
}

.leftSlider{
    position: absolute;
    background: color-mix(in srgb, var(--color-surface-light) 80%, transparent);
    width: 0.5rem;
    height: 100%;
    transform: translateX(-100%);
}
.leftSlider.active{
    cursor:pointer;
}


</style>
