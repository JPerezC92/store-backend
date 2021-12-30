import { InfrastructureError } from './InfrastructureError';

export class InternalServerError extends InfrastructureError {
  public readonly name: string = 'InternalServerError';
  public readonly message: string = 'Internal server error';
}
