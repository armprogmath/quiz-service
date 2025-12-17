import { Controller, Post, Body, UseGuards, Param, Get, Delete, Put, Req } from '@nestjs/common';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UserRoleEnum } from '@common/enums/user.role.enum';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "@common/guards/jwt-auth.guard";
import {ApiCreate} from "@common/decorators/swagger-decorators/swagger-decorators/create.decorator";
import {CreateQuizResponseDto} from "@modules/quiz/dto/create-quiz.response.dto";
import {ApiUpdate} from "@common/decorators/swagger-decorators/swagger-decorators/update.decorator";
import {ApiDelete} from "@common/decorators/swagger-decorators/swagger-decorators/delete.decorator";

@Controller('quizzes')
export class QuizController {
  constructor(private readonly service: QuizService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  @ApiCreate('quiz', CreateQuizDto, CreateQuizResponseDto)
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.service.create(createQuizDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  @ApiUpdate('quiz', CreateQuizDto, CreateQuizResponseDto)
  update(@Param('id') id: number, @Body() createQuizDto: Partial<CreateQuizDto>) {
    return this.service.update(+id, createQuizDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  @ApiDelete('quiz', CreateQuizResponseDto)
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }

  @Post(':id/questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  addQuestion(@Param('id') id: number, @Body() createQuizDto: CreateQuestionDto) {
    return this.service.addQuestion(+id, createQuizDto);
  }

  @Get()
  @Roles(UserRoleEnum.Admin, UserRoleEnum.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get list of all quizzes' })
  @ApiResponse({
    status: 200,
    description: 'List of quizzes',
    schema: {
      example: {
        data: [
          {
            id: 1,
            createdAt: '2025-12-08T10:54:40.775Z',
            updatedAt: '2025-12-08T10:57:21.451Z',
            title: 'General Knowledge',
            description: 'A short description',
            timeLimit: 60,
          },
        ]
      }
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  list() {
    return this.service.list();
  }

  @Get(':id/start')
  @Roles(UserRoleEnum.Admin, UserRoleEnum.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start a quiz attempt' })
  @ApiParam({ name: 'id', type: Number, required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Quiz attempt started successfully',
    schema: {
      example: {
        quizId: 1,
        title: 'Math',
        timeLimit: 1000,
        attemptId: 5,
        questions: [
          {
            id: 1,
            question_text: '5+7',
            options: ['1', '2', '12'],
          },
          {
            id: 2,
            question_text: '7*1',
            options: ['1', '7', '71'],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  start(@Param('id') id: number, @Req() req) {
    return this.service.start(+id, req.user?.id);
  }

  @Post(':id/submit')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit quiz answers' })
  @ApiParam({ name: 'id', type: Number, required: true, example: 1, description: 'Quiz ID' })
  @ApiBody({
    description: 'Quiz attempt answers',
    schema: {
      example: {
        attemptId: 5,
        answers: [2, 1]
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Quiz submitted successfully',
    schema: {
      example: {
        score: '1/2',
        details: [
          { questionId: 1, correctIndex: 2, userAnswer: 2, correct: true },
          { questionId: 2, correctIndex: 1, userAnswer: 0, correct: false }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid attempt or time limit exceeded' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  submit(@Param('id') id: number, @Body() body: { attemptId: number; answers: number[] }, @Req() req) {
    return this.service.submit(+id, body.attemptId, req.user.id, body.answers);
  }
}
