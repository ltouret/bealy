import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Place } from './place.entity'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({type: 'varchar', unique: true})
      email: string;

    @Column({type: 'varchar', length: 60})
      password: string;

    @OneToMany(() => Place, (place) => place.user)
      places: Place[];

    // 2fa ???????????
    // @Column({type: 'varchar', length: 70, nullable: true})
      // avatar: string;
}