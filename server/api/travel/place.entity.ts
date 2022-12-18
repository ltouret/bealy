import { JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Place extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @CreateDateColumn()
      created_at: Date;

    @UpdateDateColumn()
      updated_at: Date;

    @Column({type: 'varchar', length: 20})
      title: string;

    @Column({type: 'varchar', length: 60})
      description: string;

    @Column({type: 'varchar', length: 60})
      localisation: string;

    @Column({type: 'int4'})
      score: number;

    @Column({type: 'boolean', default: false})
      favorite: boolean;

    @ManyToOne(() => User, (user) => user.places)
    @JoinColumn()
    user: User;
}