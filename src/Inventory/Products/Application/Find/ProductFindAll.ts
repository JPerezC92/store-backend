import { UseCase } from 'src/SharedKernel/Application';
import { Product, ProductRepository } from '../../Domain';

export interface ProductFindAllOutputPort<PresenterResult> {
  show({
    productCollection,
  }: {
    productCollection: Product[];
  }): PresenterResult;
}

export class ProductFindAll<PresenterResult>
  implements UseCase<Promise<PresenterResult>, never>
{
  constructor(
    private readonly _repository: ProductRepository,
    private readonly _outputPort: ProductFindAllOutputPort<PresenterResult>,
  ) {}

  async execute(): Promise<PresenterResult> {
    const productCollection = await this._repository.findAll();

    return this._outputPort.show({ productCollection });
  }
}
