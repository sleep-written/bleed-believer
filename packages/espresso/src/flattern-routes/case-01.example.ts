import { ControllerRouting } from '../controller-routing/index.js';
import { ControllerPath } from '../controller/index.js';
import { Controller } from '../controller/index.js';
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

@ControllerPath('*')
export class All extends Controller {
    @Get()
    throwError(): void {
        this.response.json('El endpoint no existe, no sea pendejo...');
    }
}

@ControllerPath('')
export class Root extends Controller {
    @Get('*')
    load(): void {}
}

@ControllerRouting({
    path: 'Documents',
    controllers: [
        Quotation,
        Contract,
        Root
    ]
})
export class DocumentsRouting {}

@ControllerRouting({
    controllers:    [ User, All, Root ],
    routes:         [ DocumentsRouting ]
})
export class ApiRouting {}