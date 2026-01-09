
export const PathByValues = (
    values: (number | null)[],
    xScaleFunc: (i:number) => number,
    yScaleFunc: (p:number) => number ):string => {

    if(!values || values.length === 0) return "";

    let d = "";

    values.forEach((value, i) => {
        if(value == null) return;

        d += d === "" ?
            `M ${xScaleFunc(i)} ${yScaleFunc(value)} ` :
            `L ${xScaleFunc(i)} ${yScaleFunc(value)} `;
    })

    return d;
}


