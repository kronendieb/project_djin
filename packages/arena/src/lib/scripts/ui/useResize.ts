export const useResize = <T extends Element>(
    node: T,
    callback: (rect: DOMRectReadOnly) => void
) => {
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        for (const entry of entries){
            callback(entry.contentRect);
        }
    });

    observer.observe(node);

    return {
        destroy() : void{
            observer.disconnect();
        }
    }
}
