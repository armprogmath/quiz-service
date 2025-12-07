import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AttemptEntity } from './attempt.entity';
import { BaseEntity } from '@app/common/entities/base.entity';
import { UserEntity } from '@app/modules/users/user.entity';
import { QuizEntity } from '@app/modules/quiz/entities/quiz.entity';

@Entity('results')
export class ResultEntity extends BaseEntity {

  @Column()
  score: number;

  @Column('jsonb')
  answers: any;

  @ManyToOne(() => UserEntity, (u) => u.results, { nullable: true })
  user: UserEntity;

  @ManyToOne(() => QuizEntity, { nullable: true })
  quiz: QuizEntity;

  @ManyToOne(() => AttemptEntity, { nullable: true })
  attempt: AttemptEntity;
}
