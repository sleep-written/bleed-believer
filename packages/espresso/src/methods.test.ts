import { Endpoint, ENDPOINT } from './endpoint';
import { Get, Patch, Post } from './methods';

describe.only('Testing "@espresso/methods"', () => {
    it('Test class 01', () => {
        class Target {
            @Get()
            read(): void {}

            @Post()
            write(): void {}
        }

        const meta = ENDPOINT.get(Target);
        console.log(meta);
    });

    it('Test class 02', () => {
        class Target extends Endpoint {
            @Get('jajaja')
            read(): void {}

            @Get('jajaja')
            find(): void {}

            @Post('jajaja')
            write(): void {}

            @Patch()
            update(): void {}
        }

        const meta = ENDPOINT.get(Target);
        console.log(meta);
    });
});