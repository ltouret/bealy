import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// check lengths of string cos maybe will break if data is too long
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

    @Column({type: 'varchar', length: 50})
      description: string;

    @Column({type: 'varchar', length: 50})
      localisation: string;

    @Column({type: 'int4'})
      score: number;

    // 2fa ???????????
    // @Column({type: 'varchar', length: 70, nullable: true})
      // avatar: string;
}