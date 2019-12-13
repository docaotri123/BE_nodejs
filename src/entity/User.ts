import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Role } from './Role';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    @IsEmail()
    email: string;

    @Column({nullable: false})
    phone: string;

    @Column('text', {select: false})
    password: any;

    @ManyToOne(type => Role, role => role.id, {nullable: false})
    @JoinColumn()
    role: Role;
}
