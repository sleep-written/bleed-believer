import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { ContractDetail } from './contract-detail.entity.js';

@Entity({ name: 'Product' })
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar' })
    cod!: string;

    @Column({ type: 'nvarchar' })
    description!: string;

    @ManyToOne(_ => Product, r => r.id, { nullable: true })
    parent?: Relation<Product> | null;

    @OneToMany(_ => ContractDetail, r => r.product)
    contractDetails?: Relation<ContractDetail[]> | null;
}