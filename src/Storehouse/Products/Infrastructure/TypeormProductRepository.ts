import { EntityManager } from 'typeorm';
import { Product, ProductId, ProductRepository } from '../Domain';
import { ProductSchema } from '.';
import { ProductMapper } from './Mappers';

export class TypeormProductRepository implements ProductRepository {
  constructor(private readonly _manager: EntityManager) {}

  async save(product: Product): Promise<void> {
    await this._manager.save(ProductMapper.toPersistence(product));
  }

  async findAll(): Promise<Product[]> {
    const productCollection = await this._manager.find(ProductSchema);

    return productCollection.map(ProductMapper.toDomain);
  }

  async delete(product: Product): Promise<void> {
    await this._manager.remove(
      ProductSchema,
      ProductMapper.toPersistence(product),
    );
  }

  async findById(id: ProductId): Promise<Product | undefined> {
    const productSchema = await this._manager.findOne(ProductSchema, id.value);

    return productSchema && ProductMapper.toDomain(productSchema);
  }
}
