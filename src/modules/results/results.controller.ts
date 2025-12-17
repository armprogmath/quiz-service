import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ResultsService } from './results.service';
import {ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Roles} from "@common/decorators/roles.decorator";
import {UserRoleEnum} from "@common/enums/user.role.enum";
import {RolesGuard} from "@common/guards/roles.guard";

@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get('me')
  @ApiBearerAuth('access-token')
  @Roles(UserRoleEnum.Admin, UserRoleEnum.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get quiz attempts history of the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'User quiz history',
    schema: {
      example: {
        data: [
          {
            id: 7,
            createdAt: '2025-12-09T08:03:45.023Z',
            updatedAt: '2025-12-09T08:03:45.023Z',
            score: 2,
            answers: [
              { questionId: 1, userAnswer: 2, correctIndex: 2, correct: true },
              { questionId: 2, userAnswer: 1, correctIndex: 1, correct: true }
            ],
            quiz: {
              id: 1,
              createdAt: '2025-12-08T10:54:40.775Z',
              updatedAt: '2025-12-08T10:57:21.451Z',
              title: 'Math',
              description: 'Test',
              timeLimit: 1000
            },
            attempt: {
              id: 7,
              createdAt: '2025-12-09T08:03:27.083Z',
              updatedAt: '2025-12-09T08:03:45.014Z',
              startedAt: '2025-12-09T08:03:27.082Z',
              finishedAt: '2025-12-09T08:03:45.011Z'
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  myHistory(@Req() req) {
    return this.service.getUserHistory(req.user.id);
  }
}
