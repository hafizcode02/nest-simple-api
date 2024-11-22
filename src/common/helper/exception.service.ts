import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

export class MailServiceException extends HttpException {
  constructor(message: string) {
    super(message, 500);
  }
}

@Catch(ZodError, HttpException, MailServiceException)
export class ExceptionService implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: 'Validation error',
        details: exception.errors.map((error) => ({
          field: error.path.join('.'),
          message: error.message,
        })),
      });
    } else if (exception instanceof MailServiceException) {
      response.status(500).json({
        errors: exception.message,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
