import { Product, ProductId } from '.';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | undefined>;
  delete(id: Product): Promise<void>;
}
