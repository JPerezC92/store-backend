import { Response } from 'express';
import { ApiExceptionListener } from './exception-handler/ApiExceptionListener';
import {
  ApiExceptionMapping,
  ExceptionMapping,
} from './exception-handler/ApiExceptionMapping';

export abstract class ApiController {
  constructor(
    private readonly _exceptionHandler: ApiExceptionMapping,
    protected readonly apiExceptionListener: ApiExceptionListener,
  ) {
    this._exceptionHandler.register(this.exceptions());
  }

  public abstract run(...args: unknown[]): Promise<Response>;

  protected abstract exceptions(): ExceptionMapping;
}
