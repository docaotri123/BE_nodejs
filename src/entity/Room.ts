import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Type } from './Type';

@Entity()
export class Room {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar')
    description: string;

    @Column()
    imageURL: string;

    @Column()
    quality: number;

    @Column()
    price: number;

    @ManyToOne(type => Type, type => type.id)
    @JoinColumn()
    type: Type;
   
}
