import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { QuestionEntity } from './entities/question.entity';
import { ResultEntity } from '../results/entities/result.entity';
import { AttemptEntity } from '../results/entities/attempt.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Helper: Create mock repository
const mockRepo = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
});

describe('QuizService', () => {
    let service: QuizService;
    let quizRepo;
    let qRepo;
    let resultsRepo;
    let attemptsRepo;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                { provide: getRepositoryToken(QuizEntity), useValue: mockRepo() },
                { provide: getRepositoryToken(QuestionEntity), useValue: mockRepo() },
                { provide: getRepositoryToken(ResultEntity), useValue: mockRepo() },
                { provide: getRepositoryToken(AttemptEntity), useValue: mockRepo() },
            ],
        }).compile();

        service = module.get<QuizService>(QuizService);
        quizRepo = module.get(getRepositoryToken(QuizEntity));
        qRepo = module.get(getRepositoryToken(QuestionEntity));
        resultsRepo = module.get(getRepositoryToken(ResultEntity));
        attemptsRepo = module.get(getRepositoryToken(AttemptEntity));
    });

    afterEach(() => jest.clearAllMocks());

    // -------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------
    it('should create a quiz', async () => {
        const dto = { title: 'Test Quiz' };
        quizRepo.create.mockReturnValue(dto);
        quizRepo.save.mockResolvedValue({ id: 1, ...dto });

        const result = await service.create(dto);

        expect(result).toEqual({ id: 1, title: 'Test Quiz' });
        expect(quizRepo.create).toHaveBeenCalledWith(dto);
        expect(quizRepo.save).toHaveBeenCalled();
    });

    // -------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------
    it('should update a quiz', async () => {
        const quiz = { id: 1, title: 'Old' };
        quizRepo.findOne.mockResolvedValue(quiz);
        quizRepo.save.mockResolvedValue({ id: 1, title: 'New' });

        const result = await service.update(1, { title: 'New' });

        expect(result).toEqual({ id: 1, title: 'New' });
    });

    it('should throw NotFoundException when updating missing quiz', async () => {
        quizRepo.findOne.mockResolvedValue(null);

        await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    // -------------------------------------------------------------
    // REMOVE
    // -------------------------------------------------------------
    it('should remove quiz', async () => {
        const quiz = { id: 1 };
        quizRepo.findOne.mockResolvedValue(quiz);
        quizRepo.remove.mockResolvedValue({ success: true });

        const result = await service.remove(1);

        expect(result).toEqual({ success: true });
    });

    it('should throw if removing nonexistent quiz', async () => {
        quizRepo.findOne.mockResolvedValue(null);

        await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    // -------------------------------------------------------------
    // ADD QUESTION
    // -------------------------------------------------------------
    it('should add a question', async () => {
        const quiz = { id: 1 };
        quizRepo.findOne.mockResolvedValue(quiz);

        const dto = { question_text: 'Q1', options: ['a', 'b'], correct_option_index: 0 };

        qRepo.create.mockReturnValue({ ...dto, quiz });
        qRepo.save.mockResolvedValue({ id: 10, ...dto, quiz });

        const result = await service.addQuestion(1, dto);

        expect(result).toEqual({ id: 10, ...dto, quiz });
    });

    it('should throw if quiz missing when adding question', async () => {
        quizRepo.findOne.mockResolvedValue(null);

        await expect(service.addQuestion(1, {} as any)).rejects.toThrow(NotFoundException);
    });

    // -------------------------------------------------------------
    // LIST
    // -------------------------------------------------------------
    it('should list quizzes', async () => {
        quizRepo.find.mockResolvedValue([{ id: 1, title: 'Q' }]);

        const result = await service.list();

        expect(result).toEqual([{ id: 1, title: 'Q' }]);
    });

    // -------------------------------------------------------------
    // START QUIZ
    // -------------------------------------------------------------
    it('should start quiz attempt', async () => {
        const quiz = {
            id: 1,
            title: 'Quiz',
            timeLimit: 60,
            questions: [{ id: 1, question_text: 'Q1', options: ['a', 'b'] }],
        };

        quizRepo.findOne.mockResolvedValue(quiz);

        attemptsRepo.create.mockReturnValue({ id: 100 });
        attemptsRepo.save.mockResolvedValue({ id: 100 });

        const result = await service.start(1, 7);

        expect(result.quizId).toBe(1);
        expect(result.attemptId).toBe(100);
        expect(attemptsRepo.create).toHaveBeenCalled();
    });

    it('should throw if quiz not found when starting', async () => {
        quizRepo.findOne.mockResolvedValue(null);
        await expect(service.start(1, 7)).rejects.toThrow(NotFoundException);
    });

    // -------------------------------------------------------------
    // SUBMIT QUIZ
    // -------------------------------------------------------------
    it('should submit valid answers and calculate score', async () => {
        const quiz = {
            id: 1,
            questions: [
                { id: 1, correct_option_index: 0 },
                { id: 2, correct_option_index: 1 },
            ],
        };

        const attempt = { id: 11, startedAt: new Date() };

        quizRepo.findOne.mockResolvedValue(quiz);
        attemptsRepo.findOne.mockResolvedValue(attempt);

        resultsRepo.create.mockReturnValue({ id: 99 });
        resultsRepo.save.mockResolvedValue({ id: 99 });

        const result = await service.submit(1, 11, 7, [0, 1]);

        expect(result.score).toBe('2/2');
        expect(attemptsRepo.save).toHaveBeenCalled();
        expect(resultsRepo.save).toHaveBeenCalled();
    });

    it('should throw if quiz not found on submit', async () => {
        quizRepo.findOne.mockResolvedValue(null);

        await expect(service.submit(1, 11, 7, [])).rejects.toThrow(NotFoundException);
    });

    it('should throw if attempt not found on submit', async () => {
        quizRepo.findOne.mockResolvedValue({ id: 1, questions: [] });

        attemptsRepo.findOne.mockResolvedValue(null);

        await expect(service.submit(1, 11, 7, [])).rejects.toThrow(BadRequestException);
    });

    it('should throw if time limit exceeded', async () => {
        const quiz = {
            id: 1,
            timeLimit: 1, // 1 second
            questions: [{ id: 1, correct_option_index: 0 }],
        };

        const attempt = {
            id: 11,
            startedAt: new Date(Date.now() - 5000), // 5 seconds ago
        };

        quizRepo.findOne.mockResolvedValue(quiz);
        attemptsRepo.findOne.mockResolvedValue(attempt);

        await expect(service.submit(1, 11, 7, [0])).rejects.toThrow(
            BadRequestException,
        );
    });
});