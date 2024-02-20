import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { EventDetail } from './event-detail.entity.js';

@Entity({ name: 'Character' })
export class Character extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'nvarchar' })
    name!: string;

    @OneToMany(_ => EventDetail, r => r.character)
    eventDetails?: Relation<EventDetail[]> | null;
}