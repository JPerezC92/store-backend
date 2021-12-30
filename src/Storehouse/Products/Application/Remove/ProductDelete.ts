import { Product, ProductId, ProductRepository } from '../../Domain';
import { ProductFindById } from '../Find';
import { UseCase } from 'src/SharedKernel/Application';

export interface ProductDeleteInputPort {
  productId: ProductId;
}

export interface ProductDeleteOutputPort<PresenterResult> {
  show(): PresenterResult;
}

export class ProductDelete<PresenterResult>
  implements UseCase<Promise<PresenterResult>, ProductDeleteInputPort>
{
  private readonly _productFindById: ProductFindById<Product>;

  constructor(
    private readonly _repository: ProductRepository,
    private readonly _outputPort: ProductDeleteOutputPort<PresenterResult>,
  ) {
    this._productFindById = new ProductFindById(this._repository, {
      show: ({ product }) => product,
    });
  }

  public async execute({
    productId,
  }: ProductDeleteInputPort): Promise<PresenterResult> {
    const product: Product = await this._productFindById.execute({
      productId,
    });

    await this._repository.delete(product);

    return this._outputPort.show();
  }
}
