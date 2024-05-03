import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Server' })
export class Server extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 12 })
    ip!: string;

    @Column({ type: 'int' })
    port!: number;

    @Column({ type: 'nvarchar', length: 128 })
    name!: string;

    @Column({ type: 'nvarchar', length: 10 })
    version!: string;
}