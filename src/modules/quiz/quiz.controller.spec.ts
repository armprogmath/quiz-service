import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateQuestionDto } from './dto/create-question.dto';

// Mock Guards (always allow)
const mockGuard = { canActivate: jest.fn().mockReturnValue(true) };

// Mock QuizService
const mockQuizService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addQuestion: jest.fn(),
    list: jest.fn(),
    start: jest.fn(),
    submit: jest.fn(),
};

describe('QuizController', () => {
    let controller: QuizController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizController],
            providers: [
                {
                    provide: QuizService,
                    useValue: mockQuizService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockGuard)
            .overrideGuard(RolesGuard)
            .useValue(mockGuard)
            .compile();

        controller = module.get<QuizController>(QuizController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------------------
    // CREATE
    // -------------------------------------
    it('should create a quiz', async () => {
        const dto = { title: 'New Quiz' };
        mockQuizService.create.mockResolvedValue({ id: 1, ...dto });

        const result = await controller.create(dto as any);
        expect(result).toEqual({ id: 1, title: 'New Quiz' });
        expect(mockQuizService.create).toHaveBeenCalledWith(dto);
    });

    // -------------------------------------
    // UPDATE
    // -------------------------------------
    it('should update a quiz', async () => {
        const dto = { title: 'Updated Quiz' };
        mockQuizService.update.mockResolvedValue({ id: 1, ...dto });

        const result = await controller.update(1 as any, dto as any);
        expect(result).toEqual({ id: 1, title: 'Updated Quiz' });
        expect(mockQuizService.update).toHaveBeenCalledWith(1, dto);
    });

    // -------------------------------------
    // REMOVE
    // -------------------------------------
    it('should remove a quiz', async () => {
        mockQuizService.remove.mockResolvedValue({ success: true });

        const result = await controller.remove(1 as any);
        expect(result).toEqual({ success: true });
        expect(mockQuizService.remove).toHaveBeenCalledWith(1);
    });

    // -------------------------------------
    // ADD QUESTION
    // -------------------------------------
    it('should add a question', async () => {
        const dto = new CreateQuestionDto();
        mockQuizService.addQuestion.mockResolvedValue({ quizId: 1, dto });

        const result = await controller.addQuestion(1 as any, dto);
        expect(result).toEqual({ quizId: 1, dto });
        expect(mockQuizService.addQuestion).toHaveBeenCalledWith(1, dto);
    });

    // -------------------------------------
    // LIST
    // -------------------------------------
    it('should list quizzes', async () => {
        mockQuizService.list.mockResolvedValue([{ id: 1 }]);

        const result = await controller.list();
        expect(result).toEqual([{ id: 1 }]);
        expect(mockQuizService.list).toHaveBeenCalled();
    });

    // -------------------------------------
    // START QUIZ
    // -------------------------------------
    it('should start a quiz attempt', async () => {
        mockQuizService.start.mockResolvedValue({ attemptId: 123 });

        const req = { user: { id: 7 } } as any;
        const result = await controller.start(1 as any, req);

        expect(result).toEqual({ attemptId: 123 });
        expect(mockQuizService.start).toHaveBeenCalledWith(1, 7);
    });

    // -------------------------------------
    // SUBMIT QUIZ
    // -------------------------------------
    it('should submit quiz answers', async () => {
        mockQuizService.submit.mockResolvedValue({ score: 80 });

        const body = { attemptId: 55, answers: [1, 2, 3] };
        const req = { user: { id: 7 } } as any;

        const result = await controller.submit(1 as any, body, req);

        expect(result).toEqual({ score: 80 });
        expect(mockQuizService.submit).toHaveBeenCalledWith(
            1,
            55,
            7,
            [1, 2, 3],
        );
    });
});
