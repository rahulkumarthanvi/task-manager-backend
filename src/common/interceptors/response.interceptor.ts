import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<unknown>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((response: unknown) => {
        if (
          isObject(response) &&
          'success' in response &&
          'message' in response &&
          'data' in response &&
          'error' in response
        ) {
          return response as unknown as ApiResponse<unknown>;
        }

        let message = '';
        let data = response;

        if (
          isObject(response) &&
          'data' in response &&
          'message' in response &&
          typeof response.message === 'string'
        ) {
          message = response.message;
          data = response.data;
        }

        return {
          success: true,
          message,
          data,
          error: '',
        };
      }),
    );
  }
}
