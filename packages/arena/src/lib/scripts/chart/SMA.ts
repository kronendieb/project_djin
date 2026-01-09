
export const SMA = (data: Candle[], period):(number | null)[] => {
    if(!data || data.length === 0) return [];

    const result: (number|null)[] = [];

    for (let i = 0; i < data.length; i++){
        if(i < period - 1){
            result.push(null);
            continue;
        }

        let sum = 0;
        for(let j = i - period + 1; j <= i; j++){
            sum += data[j].close
        }

        result.push(sum / period);
    }

    return result;
}
