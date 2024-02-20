import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Character } from './character.entity.js';
import { Event } from './event.entity.js';

@Entity({ name: 'EventDetail' })
export class EventDetail extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'nvarchar' })
    description!: string;

    @ManyToOne(_ => Event, r => r.details)
    event?: Relation<Event> | null;

    @ManyToOne(_ => Character, r => r.eventDetails)
    character?: Relation<Character> | null;
}