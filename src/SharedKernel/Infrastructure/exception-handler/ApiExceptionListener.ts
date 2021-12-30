import { Injectable } from '@nestjs/common';

import { ApiExceptionMapping } from './ApiExceptionMapping';
import { ErrorResponse, FailureResponse, StatusType } from '..';
import { HttpStatusCode } from '../HttpResponse';
import { InternalServerError } from '../Exception/InternalServerError';

@Injectable()
export class ApiExceptionListener {
  private readonly _defaultError = new InternalServerError();

  constructor(private readonly _exceptionHandler: ApiExceptionMapping) {}

  public onException(unknownError: unknown): {
    code: HttpStatusCode;
    exceptionResponse: FailureResponse | ErrorResponse;
  } {
    const error =
      unknownError instanceof Error ? unknownError : this._defaultError;

    const { code, type } = this._exceptionHandler.statusCodeTypeFor(error);

    if (type === StatusType.FAIL) {
      return {
        code,
        exceptionResponse: {
          status: type,
          data: error.message,
        },
      };
    }

    return {
      code,
      exceptionResponse: {
        status: type,
        message: error.message,
      },
    };
  }
}
