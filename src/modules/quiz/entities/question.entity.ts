import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { QuizEntity } from './quiz.entity';
import { BaseEntity } from '@app/common/entities/base.entity';

@Entity('questions')
export class QuestionEntity extends BaseEntity {

  @Column()
  question_text: string;

  @Column('text', { array: true })
  options: string[];

  @Column()
  correct_option_index: number;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: QuizEntity;
}
