import { Post } from '@entities/post.entity.js';
import { User } from '@entities/user.entity.js';

import { Seeder } from '../core/index.js';

interface Body {
    id: number;
    body: string;
    title: string;
    userId: number;
}

export class PostSeeder extends Seeder {
    async execute(): Promise<void> {
        const resp = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await resp.json() as Body[];

        for (const item of data) {
            if (await this.manager.countBy(Post, { id: item.id }) > 0) {
                continue;
            }

            const post = new Post();
            post.id = item.id;
            post.body = item.body;
            post.title = item.title;
            post.user = await this.manager.findOneByOrFail(User, { id: item.userId });
            await this.manager.save(post);
        }
    }
}