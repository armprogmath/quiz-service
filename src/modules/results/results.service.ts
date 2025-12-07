import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultEntity } from './entities/result.entity';


@Injectable()
export class ResultsService {
  constructor(@InjectRepository(ResultEntity) private repo: Repository<ResultEntity>) {}

  async getUserHistory(userId: number) {
    return this.repo.find({ where: { user: { id: userId } as any }, relations: ['quiz', 'attempt'] });
  }
}
