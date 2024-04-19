import { Seeder } from '../seeder.js';
import { Like } from 'typeorm';

import { UserType } from '@example/entities/user-type.entity.js';
import { User } from '@example/entities/user.entity.js';

export class UserSeeder extends Seeder {
    #userTypes = new Map<string, UserType>();
    async getUserType(cod: string): Promise<UserType> {
        return (
            this.#userTypes.get(cod) ??
            await this.manager.findOneByOrFail(
                UserType,
                { cod: Like(cod) }
            )
        );
    }

    async start(): Promise<void> {
        const items = await this.getJSONData('./mocks/user.json');
        for (const item of items) {
            const userType = new UserType();
            userType.id = item.userTypeId as number;

            await this.set(User, 'dni', {
                id: item.id,
                dni: item.dni,
                name: item.name,
                userType,
            });
        }
    }
}