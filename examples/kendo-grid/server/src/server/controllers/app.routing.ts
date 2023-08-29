import { ControllerRouting } from '@bleed-believer/espresso';

import { UserController } from './user/controller.js';
import { PostController } from './post/controller.js';
import { AngularController } from './angular.controller.js';

@ControllerRouting({
    controllers: [
        PostController,
        UserController,
        AngularController,
    ]
})
export class AppRouting {}