import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Post } from './post.entity.js';

@Entity({ name: 'User' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 128 })
    name!: string;

    @Column({ type: 'varchar', length: 64 })
    username!: string;

    @Column({ type: 'varchar', length: 128 })
    email!: string;

    @OneToMany(_ => Post, r => r.user)
    posts?: Relation<Post[]> | null;
}