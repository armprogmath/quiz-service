import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { ResultEntity } from './entities/result.entity';
import { AttemptEntity } from './entities/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResultEntity, AttemptEntity])],
  providers: [ResultsService],
  controllers: [ResultsController],
  exports: [ResultsService],
})
export class ResultsModule {}
