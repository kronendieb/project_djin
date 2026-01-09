
interface Viewport {
    start: number;
    count: number;
}

export const candleWidth = (width:number, count: number) => {
    return width / count;
}

export const zoomAt = (
    viewport: Viewport,
    mouseX: number,
    width: number,
    zoomFactor: number,
    min:number,
    max:number):Viewport =>  {
    const ratio = mouseX / width;
    const newCount = Math.min(max, Math.max(min, Math.round(viewport.count * zoomFactor)))

    const centerIndex = viewport.start + Math.round(viewport.count * ratio);
    const newStart = Math.round(centerIndex - newCount * ratio);

    return {
        start: Math.max(0, newStart),
        count: newCount
    }
}

export const xScale = (i:number, length: number, width: number) => {
    return (i/(length)) * width;
}

export const yScale = (p: number, min: number, max: number, height: number) => {
    return height - ((p-min) / (max-min)) * height;
}
