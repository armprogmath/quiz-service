import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { QuestionEntity } from './entities/question.entity';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { ResultEntity } from '../results/entities/result.entity';
import { AttemptEntity } from '../results/entities/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity, QuestionEntity, ResultEntity, AttemptEntity])],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
