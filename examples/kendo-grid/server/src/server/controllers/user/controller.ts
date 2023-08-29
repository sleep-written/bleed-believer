import { Controller, Get } from '@bleed-believer/espresso';
import { KendoUITypeORM } from '@bleed-believer/kendo-grid-server';

import { User } from '@entities/user.entity.js';

export class UserController extends Controller {
    @Get()
    async get(): Promise<void> {
        const query = User
            .createQueryBuilder('User')
            .innerJoinAndSelect('User.posts', 'Post');

        const prog = new KendoUITypeORM(query);
        const data = await prog.getMany(this.request);
        this.response.json(data);
    }
}