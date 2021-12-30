export abstract class InfrastructureError extends Error {
  public abstract readonly name: string;
  public abstract readonly message: string;
  public readonly type = 'INFRASTRUCTURE_ERROR';
}
