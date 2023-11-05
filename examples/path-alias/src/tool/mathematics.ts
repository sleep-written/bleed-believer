export function mathematics(...numbers: number[]): number {
    return numbers.reduce((prev, curr) => prev + curr, 0);
}