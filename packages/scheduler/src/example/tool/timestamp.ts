export function timestamp(...message: string[]): void {
    const date = new Date();
    const [ hh, mm, ss ] = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ]
    .map(x => x.toString())
    .map(x => x.padStart(2, '0'));

    console.log(`[${hh}:${mm}:${ss}] ->`, ...message);
}