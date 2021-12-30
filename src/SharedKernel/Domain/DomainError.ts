export abstract class DomainError extends Error {
  abstract readonly name: string;
  abstract readonly message: string;
  public readonly type = 'DOMAIN_ERROR';
}
