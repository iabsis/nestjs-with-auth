import {
  ExceptionFilter,
  Catch,
  UnauthorizedException,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as any;
    if (request.headers.authorization) {
      const token = request.headers.authorization.split(' ')[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        error.reason = 'jwt-unauthorized';
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          error.reason = 'jwt-expired';
        } else if (err instanceof jwt.JsonWebTokenError) {
          error.reason = 'jwt-invalid';
        }
      }
    }

    response.status(status).json(error);
  }
}
