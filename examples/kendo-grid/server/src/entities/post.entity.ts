import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'Post' })
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'nvarchar', length: 512 })
    title!: string;

    @Column({ type: 'nvarchar', length: 2048 })
    body!: string;

    @ManyToOne(_ => User, r => r.posts)
    user?: Relation<User> | null;
}