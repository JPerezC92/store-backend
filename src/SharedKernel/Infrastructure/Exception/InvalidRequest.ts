import { InfrastructureError } from './InfrastructureError';

export class InvalidRequest extends InfrastructureError {
  public readonly name: string = 'InvalidRequest';
  constructor(public readonly message: string) {
    super(message);
  }
}
