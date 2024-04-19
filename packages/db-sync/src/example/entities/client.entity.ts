import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Contract } from './contract.entity.js';

@Entity({ name: 'Client' })
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'nvarchar' })
    name!: string;

    @Column({ type: 'nvarchar' })
    address!: string;

    @OneToMany(_ => Contract, r => r.client)
    contracts?: Relation<Contract[]> | null;
}
