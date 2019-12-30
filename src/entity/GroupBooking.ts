import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class GroupBooking {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'datetime', nullable: false})
    startDate: Date;

    @Column({ type: 'datetime', nullable: false})
    endDate: Date;

    @ManyToOne(type => User, user => user.id, {nullable: false})
    @JoinColumn()
    user: User;
}
