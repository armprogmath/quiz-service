import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {SendQuizCalculationRoutingKey, Topics} from "@common/event-constants/constants";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {RabbitPublish} from "@common/decorators/rmq.publisher.decorator";
import {RabbitRPCPublish} from "@common/decorators/rpc.publisher.decorator";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private jwt: JwtService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async register(registerDto: RegisterDto) {
    
    const exists = await this.usersRepo.findOne({ where: { email: registerDto.email } });

    if (exists) {
      throw new BadRequestException('Email already in use');
    }
    const hash = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepo.create({ email: registerDto.email, password: hash, role: registerDto.role });

    await this.usersRepo.save(user);

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: loginDto.email } });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const match = +await bcrypt.compare(loginDto.password, user.password);

    if (!match) {
      throw new BadRequestException('Invalid credentials')
    }

    const payload = { sub: user.id, email: user.email, role: user.role};

    const token = this.jwt.sign(payload);

    return { access_token: token };
  }

  @RabbitRPCPublish(Topics.EventQuizCalcTopic, SendQuizCalculationRoutingKey.QuizCalculationSentRK)
  async sendData(dataDto: any){
    const data = JSON.stringify(dataDto)
    console.log("The data has been sent successfully", data);
    return JSON.stringify(data, null, 2)
  }
  //
  // async sendData(dataDto: any){
  //   const result = await this.sendDataProducer(dataDto)
  //   console.log("Result: ", result)
  //   return result
  // }
}
