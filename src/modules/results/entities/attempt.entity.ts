import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from '@app/common/entities/base.entity';
import { UserEntity } from '@app/modules/users/user.entity';
import { QuizEntity } from '@app/modules/quiz/entities/quiz.entity';

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
