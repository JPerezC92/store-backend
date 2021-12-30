import * as Joi from 'joi';
import { ProductIdDeleteRequest } from './ProductIdDeleteController';
import { InvalidRequest } from 'src/SharedKernel/Infrastructure/Exception/InvalidRequest';

export const productsPostRequestSchema = Joi.object<ProductIdDeleteRequest>({
  params: { productId: Joi.string().required().uuid() },
});

export const ProductIdDeleteValidator = (
  productsPostRequest: ProductIdDeleteRequest,
): ProductIdDeleteRequest => {
  const { error } = productsPostRequestSchema.validate(productsPostRequest);

  if (error) throw new InvalidRequest(error.message);

  return productsPostRequest;
};
