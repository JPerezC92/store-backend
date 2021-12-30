import { StatusType } from '..';
import { HttpStatusCode } from '../HttpResponse';
import { InvalidRequest } from '../Exception/InvalidRequest';
import { InternalServerError } from '../Exception/InternalServerError';
import { Injectable } from '@nestjs/common';

interface ExceptionCodeType {
  code: HttpStatusCode;
  type: StatusType.ERROR | StatusType.FAIL;
}

export interface ExceptionMapping {
  [key: string]: ExceptionCodeType;
}

@Injectable()
export class ApiExceptionMapping {
  private _exceptions: ExceptionMapping = {
    [InvalidRequest.name]: {
      code: HttpStatusCode.BadRequest,
      type: StatusType.FAIL,
    },
    [InternalServerError.name]: {
      code: HttpStatusCode.InternalServerError,
      type: StatusType.ERROR,
    },
  };

  public register(exceptions: ExceptionMapping): void {
    this._exceptions = { ...this._exceptions, ...exceptions };
  }

  public statusCodeTypeFor(error: Error): ExceptionCodeType {
    const httpStatusCodeType = this._exceptions[error.name];

    if (!httpStatusCodeType)
      throw new Error(`No HttpStatusCodeType found for error: ${error.name}`);

    return httpStatusCodeType;
  }
}
