import { Seeder } from '../core/index.js';
import { User } from '@entities/user.entity.js';

interface Body {
    id: number;
    name: string;
    username: string;
    email: string;
}

export class UserSeeder extends Seeder {
    async execute(): Promise<void> {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await resp.json() as Body[];

        for (const item of data) {
            if (await this.manager.countBy(User, { id: item.id }) > 0) {
                continue;
            }

            const user = new User();
            user.id = item.id;
            user.name = item.name;
            user.email = item.email;
            user.username = item.username;
            await this.manager.save(user);
        }
    }
}