import { ProductSchema } from '..';
import {
  Product,
  ProductDescription,
  ProductId,
  ProductName,
} from '../../Domain';

export const ProductMapper = {
  toDomain: (productSchema: ProductSchema): Product =>
    new Product({
      id: new ProductId(productSchema.id),
      name: new ProductName(productSchema.name),
      description: new ProductDescription(productSchema.description),
    }),

  toPersistence: (product: Product): ProductSchema => {
    const productSchema = new ProductSchema();

    Object.assign(productSchema, {
      id: product.id,
      name: product.name,
      description: product.description,
    });

    return productSchema;
  },
};
