import { UserType } from '../../entities/user-type.entity.js';
import { Seeder } from '../seeder.js';

export class UserTypeSeeder extends Seeder {
    async start(): Promise<void> {
        const items = await this.getJSONData<UserType>('./mocks/user-type.json');
        for (const item of items) {
            await this.set(UserType, 'cod', {
                id: item.id,
                cod: item.cod,
                description: item.description
            });
        }
    }
}
