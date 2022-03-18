import { Endpoint, ENDPOINT } from './endpoint';
import { Get, Post } from './methods';

describe.only('Testing "@espresso/methods"', () => {
    it('Simple method class', () => {
        class Target extends Endpoint {
            @Get()
            read(): void {}

            @Post()
            write(): void {}
        }

        const meta = ENDPOINT.get(Target);
        console.log(meta);
    });
});