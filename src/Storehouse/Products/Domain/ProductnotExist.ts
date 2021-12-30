import { ProductId } from '.';
import { DomainError } from '../../../SharedKernel/Domain/DomainError';

export class ProductNotExist extends DomainError {
  public readonly name = 'ProductNotExist';
  private readonly _productId: ProductId;
  public get message(): string {
    return `El curso no existe, ${this._productId.value}`;
  }

  constructor(productId: ProductId) {
    super();
    this._productId = productId;
  }
}
