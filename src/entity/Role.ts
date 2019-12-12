import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column('varchar')
    role: string;
    @Column('varchar')
    test: string;
}
