import { Seeder } from '../seeder.js';
import { Like } from 'typeorm';

import { UserType } from '../../entities/user-type.entity.js';
import { User } from '../../entities/user.entity.js';

export class UserSeeder extends Seeder {
    #userTypes = new Map<string, UserType>();
    async getUserType(cod: string): Promise<UserType> {
        return  this.#userTypes.get(cod) ??
                await this.manager.findOneByOrFail(
                    UserType,
                    { cod: Like(cod) }
                );
    }

    async start(): Promise<void> {
        await this.set(User, 'dni', {
            dni: '1-9',
            name: 'Brian Carroll',
            userType: await this.getUserType('ADMIN'),
        });
    
        await this.set(User, 'dni', {
            dni: '11.111.111-1',
            name: 'MD. Dragynfly',
            userType: await this.getUserType('GUEST'),
        });
    }
}