import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from '@common/entities/base.entity';
import {QuizEntity} from '../../quiz/entities/quiz.entity'
import { UserEntity } from '../../users/user.entity'

@Entity('attempts')
export class AttemptEntity extends BaseEntity {
 
  @Column({ type: 'timestamptz' })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date;

  @ManyToOne(() => UserEntity, { nullable: true })
  user: UserEntity;

  @ManyToOne(() => QuizEntity, { nullable: true })
  quiz: QuizEntity;
}
