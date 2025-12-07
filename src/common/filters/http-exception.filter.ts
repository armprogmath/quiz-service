import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { MESSAGES } from '@nestjs/core/constants';
import { error } from 'console';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

     const exceptionResponse = exception.getResponse();
    let message: string | string[];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse.hasOwnProperty('message')) {
      message = (exceptionResponse as any).message;
    } else {
      message = 'Unexpected error';
    }

    response
      .status(status)
      .json({
        statusCode: status,
        message,
        path: request.url,  
        timestamp: new Date().toISOString(),
      });
  }
}