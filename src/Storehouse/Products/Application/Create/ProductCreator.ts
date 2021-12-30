import { UseCase } from 'src/SharedKernel/Application';
import {
  Product,
  ProductDescription,
  ProductId,
  ProductName,
  ProductRepository,
} from '../../Domain';

export interface ProductCreatorInputPort {
  id: ProductId;
  name: ProductName;
  description: ProductDescription;
}

export interface ProductCreatorOutputPort<PresenterResult> {
  show(): PresenterResult;
}

export class ProductCreator<PresenterResult>
  implements UseCase<Promise<PresenterResult>, ProductCreatorInputPort>
{
  constructor(
    private readonly _repository: ProductRepository,
    private readonly _outputPort: ProductCreatorOutputPort<PresenterResult>,
  ) {}

  public async execute({
    id,
    name,
    description,
  }: ProductCreatorInputPort): Promise<PresenterResult> {
    const product = new Product({
      id: id,
      name: name,
      description: description,
    });

    await this._repository.save(product);

    return this._outputPort.show();
  }
}
