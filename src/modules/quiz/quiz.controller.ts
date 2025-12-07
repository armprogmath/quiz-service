import { Controller, Post, Body, UseGuards, Param, Get, Delete, Put, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UserRoleEnum } from '@common/enums/user.role.enum';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly service: QuizService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.service.create(createQuizDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  update(@Param('id') id: number, @Body() createQuizDto: Partial<CreateQuizDto>) {
    return this.service.update(+id, createQuizDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
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
  list() {
    return this.service.list();
  }

  @Get(':id/start')
  @UseGuards(JwtAuthGuard)
  start(@Param('id') id: number, @Req() req) {
    return this.service.start(+id, req.user?.id);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  submit(@Param('id') id: number, @Body() body: { attemptId: number; answers: number[] }, @Req() req) {
    return this.service.submit(+id, body.attemptId, req.user.id, body.answers);
  }
}
