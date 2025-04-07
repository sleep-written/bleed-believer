export class StatsError extends Error {
    constructor(path?: string) {
        super(
            typeof path === 'string'
            ?   `Failed to get stats from '${path}'`
            :   'Failed to get stats'
        );
    }
}
