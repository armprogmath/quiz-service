import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRoleEnum } from '@app/common/enums/user.role.enum';
import { BaseEntity } from '@app/common/entities/base.entity';
import { ResultEntity } from '../results/entities/result.entity';

@Entity('users')
export class UserEntity extends BaseEntity {

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "varchar", nullable: false})
  public role: UserRoleEnum;

  @OneToMany(() => ResultEntity, (r) => r.user)
  results: ResultEntity[];
}
