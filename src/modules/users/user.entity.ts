import { Entity, Column, OneToMany } from 'typeorm';
import { UserRoleEnum } from '@common/enums/user.role.enum';
import { ResultEntity } from '../results/entities/result.entity';
import {BaseEntity} from "@common/entities/base.entity";

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
