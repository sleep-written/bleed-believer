import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Contract } from './contract.entity.js';
import { Product } from './product.entity.js';

@Entity({ name: 'ContractDetail' })
export class ContractDetail extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantity!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price!: number;

    @ManyToOne(_ => Product, r => r.contractDetails)
    product?: Relation<Product> | null;

    @ManyToOne(_ => Contract, r => r.contractDetails)
    contract?: Relation<Contract> | null;
}
