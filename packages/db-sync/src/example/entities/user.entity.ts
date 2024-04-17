import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation } from 'typeorm';
import { UserType } from './user-type.entity.js';

@Entity({ name: 'User' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar' })
    dni!: string;

    @Column({ type: 'nvarchar' })
    name!: string;

    @ManyToOne(_ => UserType, r => r.users)
    userType?: Relation<UserType> | null;
}