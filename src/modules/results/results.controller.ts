import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  myHistory(@Req() req) {
    return this.service.getUserHistory(req.user.id);
  }
}
