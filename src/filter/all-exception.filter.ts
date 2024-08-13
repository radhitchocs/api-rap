import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { GenericErrorEnum } from '../enum/generic-error.enum';
import { InternalServiceException } from '../module/rest/exception/internal-service.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof InternalServiceException) {
      this.axios(exception, request, response);
    } else if (exception instanceof ForbiddenException) {
      this.forbidden(exception, request, response);
    } else if (exception instanceof BadRequestException) {
      this.badRequest(exception, request, response);
    } else if (exception instanceof UnauthorizedException) {
      this.unauthorized(exception, request, response);
    } else {
      this.unknownException(exception, request, response);
    }
  }

  private axios(exception: any, request: any, response: any) {
    const error = exception.error;
    const axiosResponse = exception.error?.response || exception.response;
    const axiosRequest = exception.error?.request || exception.request;
    if (axiosResponse) {
      // The request was made and the server responded with a status code
      const status =
        axiosResponse.data?.statusCode || axiosResponse.statusCode || 500;
      response.status(status).json({
        statusCode: status,
        message: axiosResponse.data?.message || axiosResponse.message,
        code: axiosResponse.data?.code,
        errors: axiosResponse.data?.errors || axiosResponse.error,
      });
    } else if (axiosRequest) {
      // The request was made but no response was received
      const subCode = error?.code || axiosRequest.code;
      let statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      let code = GenericErrorEnum.apiFailure;
      const message =
        error?.message || axiosRequest.message || exception.message;
      if (subCode === 'ECONNABORTED') {
        statusCode = HttpStatus.REQUEST_TIMEOUT;
        code = GenericErrorEnum.requestTimeout;
      }
      response.status(statusCode).json({
        statusCode: statusCode,
        message: 'service error',
        code: code,
        errors: [
          {
            message: message,
            code: subCode,
          },
        ],
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      this.unknownException(exception, request, response);
    }
  }

  private forbidden(
    exception: ForbiddenException,
    request: any,
    response: any,
  ) {
    const statusCode = HttpStatus.FORBIDDEN;
    const code = GenericErrorEnum.forbiddenResource;
    const message = 'The requested resource is forbidden';
    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      code: code,
      errors: [
        {
          message: message,
          code: code,
        },
      ],
    });
  }

  private badRequest(
    exception: BadRequestException,
    request: any,
    response: any,
  ) {
    const exceptionResponse: any = exception.getResponse();
    const messages = exceptionResponse.message || exception.message;
    console.log(messages);
    if (Array.isArray(messages)) {
      // exception from class-validator
      const errors = [];
      messages.forEach((message) => {
        if (typeof message.constraints === 'object') {
          Object.keys(message.constraints)
            .slice(0, 1)
            .forEach((key) => {
              errors.push({
                code: GenericErrorEnum.invalidParameter,
                field: message.property,
                message: message.constraints[key],
              });
            });
        } else {
          errors.push({
            code: GenericErrorEnum.invalidParameter,
            message: message,
          });
        }
      });
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        code: GenericErrorEnum.invalidParameter,
        message: 'Invalid parameter',
        errors: errors,
      });
    } else {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: messages,
        code: GenericErrorEnum.invalidParameter,
        errors: [
          {
            message: messages,
            code: GenericErrorEnum.invalidParameter,
          },
        ],
      });
    }
  }

  private unauthorized(
    exception: UnauthorizedException,
    request: any,
    response: any,
  ) {
    const statusCode = HttpStatus.UNAUTHORIZED;
    const code = GenericErrorEnum.unauthorized;
    const message = 'Unauthorized';
    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      code: code,
      errors: [
        {
          message: message,
          code: code,
        },
      ],
    });
  }

  private unknownException(exception: any, request: any, response: any) {
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const code = GenericErrorEnum.unknownError;
    const message = 'Service error';
    const errorMessage = exception.message || 'Unknown error';

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      code: code,
      errors: [
        {
          message: errorMessage,
          code: code,
        },
      ],
    });
  }
}
