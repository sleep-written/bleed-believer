import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'UserType' })
export class UserType extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar' })
    cod!: string;

    @Column({ type: 'nvarchar' })
    description!: string;

    @OneToMany(_ => User, r => r.userType)
    users?: Relation<User[]> | null;
}