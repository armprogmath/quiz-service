import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
//import chalk from 'chalk';
const chalk = require('chalk');

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const configService: ConfigService = app.get(ConfigService);

  // const config = new DocumentBuilder()
  //   .addBearerAuth()
  //   .setTitle('Quiz Engine API')
  //   .setDescription('Pass your IQ test')
  //   .setVersion('1.0')
  //   .build();
  //
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  // SwaggerModule.setup('docs', app, document);


  // SWAGGER CONFIG STARTS
  const PORT = configService.get('PORT', 3003);

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Quiz Engine API')
      .setDescription('IQ Test Quiz Application')
      .setVersion('1.0.0')
      .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header',
          },
          'access-token',
      )
      .addServer(`http://localhost:${PORT}/api`, 'Local Server')
      .addServer(`http://localhost:${PORT}/api`, 'Production Server')
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Quiz Engine API Docs',
    customCss: `
      .swagger-ui .topbar { display: none }
    `,
  });

  // SWAGGER CONFIG ENDS

  app.setGlobalPrefix('api');

   await app.listen(configService.get('PORT', 3003), async () => Logger.log(`${await app.getUrl()}, API Doc: ${configService.get('APP_URL')}`))

}
//bootstrap().then(() => Logger.log(chalk.italic.black.bgWhiteBright` Quiz application ` + ` successfully started in ${process.env.NODE_ENV || 'development' || 'production'} mode`));
bootstrap().then(() => Logger.log(`Quiz application successfully started in ${process.env.NODE_ENV || 'development' || 'production'} mode`));