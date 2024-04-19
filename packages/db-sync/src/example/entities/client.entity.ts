import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import type { Contract } from './contract.entity.js';

@Entity({ name: 'Client' })
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'nvarchar' })
    name!: string;

    @Column({ type: 'nvarchar' })
    address!: string;

    contracts?: Relation<Contract[]> | null;
}
