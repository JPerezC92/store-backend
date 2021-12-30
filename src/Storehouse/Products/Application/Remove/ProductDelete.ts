import { UseCase } from 'src/SharedKernel/Application';
import { ProductId, ProductNotExist, ProductRepository } from '../../Domain';

export interface ProductDeleteInputPort {
  productId: ProductId;
}

export interface ProductDeleteOutputPort<PresenterResult> {
  show(): PresenterResult;
}

export class ProductDelete<PresenterResult>
  implements UseCase<Promise<PresenterResult>, ProductDeleteInputPort>
{
  constructor(
    private readonly _repository: ProductRepository,
    private readonly _outputPort: ProductDeleteOutputPort<PresenterResult>,
  ) {}

  public async execute({
    productId,
  }: ProductDeleteInputPort): Promise<PresenterResult> {
    const product = await this._repository.findById(productId);

    if (!product) {
      throw new ProductNotExist(productId);
    }

    await this._repository.delete(product);

    return this._outputPort.show();
  }
}
