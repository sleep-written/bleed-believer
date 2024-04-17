import { UserType } from '../../entities/user-type.entity.js';
import { Seeder } from '../seeder.js';

export class UserTypeSeeder extends Seeder {
    async start(): Promise<void> {
        await this.set(UserType, 'cod', {
            cod: 'SYSTEM',
            description: 'Root user'
        });

        await this.set(UserType, 'cod', {
            cod: 'ADMIN',
            description: 'Administrator of the system'
        });

        await this.set(UserType, 'cod', {
            cod: 'GUEST',
            description: 'Guest user'
        });
    }
}
