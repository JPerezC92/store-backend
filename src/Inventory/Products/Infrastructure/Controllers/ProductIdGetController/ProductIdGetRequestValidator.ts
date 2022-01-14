import * as Joi from 'joi';
import { InvalidRequest } from 'src/SharedKernel/Infrastructure/Exception/InvalidRequest';
import { ProductIdGetRequest } from './ProductIdGetController';

const productIdGetRequestSchema = Joi.object<ProductIdGetRequest>({
  params: { productId: Joi.string().required().uuid() },
});

export const ProductIdGetRequestValidator = (
  productIdGetRequest: ProductIdGetRequest,
): ProductIdGetRequest => {
  const { error } = productIdGetRequestSchema.validate(productIdGetRequest);

  if (error) throw new InvalidRequest(error.message);

  return productIdGetRequest;
};
