import {
  Product,
  ProductId,
  ProductNotExist,
  ProductRepository,
} from '../../Domain';

export interface ProductFindByIdInputPort {
  productId: ProductId;
}

export interface ProductFindByIdOutputPort<PresenterResult> {
  show({ product }: { product: Product }): PresenterResult;
}

export class ProductFindById<PresenterResult> {
  constructor(
    private readonly _productRepository: ProductRepository,
    private readonly _outputPort: ProductFindByIdOutputPort<PresenterResult>,
  ) {}

  public async execute({
    productId,
  }: ProductFindByIdInputPort): Promise<PresenterResult> {
    const product = await this._productRepository.findById(productId);

    if (!product) {
      throw new ProductNotExist(productId);
    }

    return this._outputPort.show({ product });
  }
}
