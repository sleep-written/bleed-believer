import { ControllerRouting } from '@bleed-believer/espresso';

import { TestController } from './test.controller';

@ControllerRouting({
    controllers: [
        TestController,
    ]
})
export class ApiRouting {}