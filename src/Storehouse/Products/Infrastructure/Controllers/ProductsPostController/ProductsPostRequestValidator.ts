import * as Joi from 'joi';
import { BadRequestException } from '@nestjs/common';
import { StatusType } from 'src/SharedKernel/Infrastructure';
import {
  ProductsPostBody,
  ProductsPostRequest,
} from './ProductsPostController';

export const productsPostRequestSchema = Joi.object<ProductsPostRequest>({
  body: Joi.object<ProductsPostBody>({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
});

export const ProductsPostRequestValidator = (
  productsPostRequest: ProductsPostRequest,
) => {
  const { error } = productsPostRequestSchema.validate(productsPostRequest);

  if (error) {
    throw new BadRequestException({
      status: StatusType.FAIL,
      data: error.message,
    });
  }

  return productsPostRequest;
};
