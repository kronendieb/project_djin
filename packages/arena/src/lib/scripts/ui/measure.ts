export const measure = (node: HTMLElement) => {
    const ro = new ResizeObserver(([entry]) => {
        const {width, height} = entry.contentRect;
        node.dispatchEvent(new CustomEvent('resize', {detail: {width, height}}));
    });

    ro.observe(node);

    return {
        destroy() {
            ro.disconnect();
        }
    }
}
