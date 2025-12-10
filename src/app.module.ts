import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { QuizModule } from '@modules/quiz/quiz.module';
import { ResultsModule } from '@modules/results/results.module';
import { UserEntity } from '@modules/users/user.entity';
import { QuestionEntity } from '@modules/quiz/entities/question.entity';
import { QuizEntity } from '@modules/quiz/entities/quiz.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseStyleInterceptor } from '@common/interceptors/response.style.interceptor';
import { ResultEntity } from '@modules/results/entities/result.entity';
import { AttemptEntity } from '@modules/results/entities/attempt.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from "path";
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import {RabbitMQGlobalModule} from '@app/rabbitmq.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      expandVariables: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', '/public/uploads'),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      autoLoadEntities: true,
    }),

     ThrottlerModule.forRoot([{
      ttl: 6000,
      limit: 10,
      ignoreUserAgents: [

        /googlebot/gi,

        new RegExp('bingbot', 'gi'),
      ],
    }]),

    TypeOrmModule.forFeature([UserEntity, QuizEntity, QuestionEntity, ResultEntity, AttemptEntity]),

    RabbitMQGlobalModule,
    AuthModule,
    UsersModule,
    QuizModule,
    ResultsModule,
    TestModule,
  ],
  providers:[
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStyleInterceptor
    },
     {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ]
})
export class AppModule {}
