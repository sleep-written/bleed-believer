import { Controller, Get } from '@bleed-believer/espresso';

export class TestController extends Controller {
    @Get()
    get(): void {
        this.response.json({
            text: 'jajaja',
            value: 666
        });
    }

    @Get('test01')
    test01(): void {
        this.response.json('This is the first test!');
    }

    @Get('test02')
    test02(): void {
        throw new Error('Your API is dead!');
    }
}