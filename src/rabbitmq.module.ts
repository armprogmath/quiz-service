import { Module, Global } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExchangeType, Topics } from '@common/event-constants/constants';

@Global()
@Module({
    imports: [
        ConfigModule,
        RabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                queueOptions: {
                    arguments: {
                        'x-message-ttl': 10000, // 10 seconds
                    },
                    durable: true,
                },
                exchanges: [
                    {
                        name: Topics.EventQuizCalcTopic,
                        type: ExchangeType.Topic,
                    },
                ],
                //uri: configService.get<string>('RABBITMQ_URL'), // From .env
                uri: 'amqp://localhost:5672',
                connectionInitOptions: { wait: true },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [RabbitMQModule],
})
export class RabbitMQGlobalModule {}
