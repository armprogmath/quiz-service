import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { QuestionEntity } from './entities/question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ResultEntity } from '../results/entities/result.entity';
import { AttemptEntity } from '../results/entities/attempt.entity';


@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity) private quizRepo: Repository<QuizEntity>,
    @InjectRepository(QuestionEntity) private qRepo: Repository<QuestionEntity>,
    @InjectRepository(ResultEntity) private resultsRepo: Repository<ResultEntity>,
    @InjectRepository(AttemptEntity) private attemptsRepo: Repository<AttemptEntity>,
  ) {}



  async create(createQuizDto: CreateQuizDto) {

    const quiz = this.quizRepo.create(createQuizDto);

    return this.quizRepo.save(quiz);
  }



  async update(id: number, createQuizDto: Partial<CreateQuizDto>) {

    const quiz = await this.quizRepo.findOne({ where: { id } });

    if (!quiz) throw new NotFoundException('Quiz not found');

    Object.assign(quiz, createQuizDto);

    return this.quizRepo.save(quiz);
  }



  async remove(id: number) {

    const quiz = await this.quizRepo.findOne({ where: { id } });
    
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.quizRepo.remove(quiz);
  }



  async addQuestion(quizId: number, createQuestionDto: CreateQuestionDto) {

    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const question = this.qRepo.create({ ...createQuestionDto, quiz });

    return this.qRepo.save(question);
  }



  async list() {
    return this.quizRepo.find({ relations: ['questions'] });
  }

  async start(quizId: number, userId?: number) {

    const quiz = await this.quizRepo.findOne({ where: { id: quizId }, relations: ['questions'] });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    const questions = quiz.questions.map((q) => ({ id: q.id, question_text: q.question_text, options: q.options }));

    const attempt = this.attemptsRepo.create({ startedAt: new Date(), quiz, user: userId ? ({ id: userId } as any) : null });

    await this.attemptsRepo.save(attempt);

    return { quizId: quiz.id, title: quiz.title, timeLimit: quiz.timeLimit, attemptId: attempt.id, questions };
  }

  async submit(quizId: number, attemptId: number, userId: number, answers: number[]) {

    const quiz = await this.quizRepo.findOne({ where: { id: quizId }, relations: ['questions'] });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    const attempt = await this.attemptsRepo.findOne({ where: { id: attemptId } });

    if (!attempt) {
      throw new BadRequestException('Invalid attempt');
    }

    if (quiz.timeLimit && attempt.startedAt) {
      const spent = (Date.now() - attempt.startedAt.getTime()) / 1000;
      if (spent > quiz.timeLimit) {
        throw new BadRequestException('Time limit exceeded');
      }
    }

    let score = 0;
    const answersMap = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];

      const userAns = answers[i];

      const correct = q.correct_option_index === userAns;

      if (correct) {
        score++
      };

      answersMap.push({ questionId: q.id, correctIndex: q.correct_option_index, userAnswer: userAns, correct });
    }

    const result = this.resultsRepo.create({ score, answers: answersMap, quiz, user: { id: userId } as any, attempt });

    attempt.finishedAt = new Date();

    await this.attemptsRepo.save(attempt);

    await this.resultsRepo.save(result);

    return { score: `${score}/${quiz.questions.length}`, details: answersMap };
  }
}
