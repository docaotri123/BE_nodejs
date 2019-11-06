import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Type {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column('varchar')
    type: string;
}
