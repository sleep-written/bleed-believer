import { Controller, Get } from '@bleed-believer/espresso';
import { KendoUITypeORM } from '@bleed-believer/kendo-grid-server';
import { Post } from '@entities/post.entity.js';

export class PostController extends Controller {
    @Get()
    async get(): Promise<void> {
        const query = Post
            .createQueryBuilder('Post')
            .innerJoinAndSelect('Post.user', 'User')
            // .select([
            //     'Post.title AS title',
            //     'Post.body AS body',
            //     'User.name AS name',
            // ]);

        const prog = new KendoUITypeORM(query);
        const resp = await prog.getMany(this.request);
        this.response.json(resp);
    }
}