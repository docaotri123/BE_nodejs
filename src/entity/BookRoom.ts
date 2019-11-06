import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Room } from './Room';

@Entity()
export class BookRoom {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({nullable: false})
    startDate: Date;

    @Column({nullable: false})
    endDate: Date;

    @Column({default: false})
    isCancelled: boolean;

    @ManyToOne(type => User, user => user.id, {nullable: false})
    @JoinColumn()
    role: User;

    @ManyToOne(type => Room, room => room.id, {nullable: false})
    @JoinColumn()
    room: Room;
}
