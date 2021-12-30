import { ProductDescription, ProductId, ProductName } from '.';

// export interface ProductScrema {
//   id: string;
//   name: string;
//   description: string;
// }

export class Product {
  private readonly _id: ProductId;
  private readonly _name: ProductName;
  private readonly _description: ProductDescription;

  constructor(props: {
    readonly id: ProductId;
    readonly name: ProductName;
    readonly description: ProductDescription;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
  }

  public get id(): string {
    return this._id.value;
  }

  public get name(): string {
    return this._name.value;
  }

  public get description(): string {
    return this._description.value;
  }
}
