import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Place } from './place.entity'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({type: 'varchar', unique: true}) // unique?
      email: string;

    @Column({type: 'varchar', length: 60})
      password: string;

    @OneToMany(() => Place, (place) => place.user)
      places: Place[];

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 12);
    }

    static async comparePasswords(
      candidatePassword: string,
      hashedPassword: string
      ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    toJSON() {
      return {...this, password: undefined};
    }

    // 2fa ???????????
    // @Column({type: 'varchar', length: 70, nullable: true})
      // avatar: string;
}