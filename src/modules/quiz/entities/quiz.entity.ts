import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { BaseEntity } from '@app/common/entities/base.entity';

@Entity('quizzes')
export class QuizEntity extends BaseEntity {

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  timeLimit: number;

  @OneToMany(() => QuestionEntity, (q) => q.quiz, { cascade: true })
  questions: QuestionEntity[];
}
