import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const _request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let error = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const payload = exceptionResponse as Record<string, unknown>;
        const payloadMessage = payload.message;

        if (Array.isArray(payloadMessage)) {
          message = payloadMessage.join(', ');
        } else if (typeof payloadMessage === 'string') {
          message = payloadMessage;
        } else {
          message = exception.message || 'Request failed';
        }

        if (typeof payload.error === 'string') {
          error = payload.error;
        } else {
          error = message;
        }
      } else {
        message = exception.message || 'Request failed';
        error = message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || 'Internal server error';
      error = message;
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
      error,
    });
  }
}
