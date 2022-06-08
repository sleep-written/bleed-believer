import { ControllerRouting } from './controller-routing.js';
import { Controller } from '../controller/controller.js';
import { Post, Get } from '../endpoint/index.js';

export class User extends Controller {
    @Post('login')
    login(): void {}

    @Get(':id')
    findOne(): void {}

    @Post()
    save(): void {}
}

export class Quotation extends Controller {
    @Get(':id')
    findOne(): void {}

    @Post()
    save(): void {}
}

export class Contract extends Controller {
    @Get(':id')
    findOne(): void {}

    @Post()
    save(): void {}
}

@ControllerRouting({
    path: 'Documents',
    controllers: [
        Quotation,
        Contract
    ]
})
export class DocumentsRouting {}

@ControllerRouting({
    controllers:    [ User ],
    routes:         [ DocumentsRouting ]
})
export class ApiRouting {}