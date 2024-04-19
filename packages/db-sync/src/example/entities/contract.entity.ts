import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Client } from './client.entity.js';
import { User } from './user.entity.js';

@Entity({ name: 'Contract' })
export class Contract extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'int' })
    corr!: number;

    @Column({ type: 'datetime' })
    date!: Date;

    @ManyToOne(_ => Client, r => r.contracts)
    client?: Relation<Client> | null;

    @ManyToOne(_ => User, r => r.contracts)
    user?: Relation<User> | null;
}