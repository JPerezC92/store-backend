import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UnitOfWork } from 'src/SharedKernel/Infrastructure/database/unitOfWork.service';
import { StatusType, SuccessResponse } from 'src/SharedKernel/Infrastructure';
import { ApiController } from 'src/SharedKernel/Infrastructure/ApiController';
import { ApiExceptionListener } from 'src/SharedKernel/Infrastructure/exception-handler/ApiExceptionListener';
import {
  ApiExceptionMapping,
  ExceptionMapping,
} from 'src/SharedKernel/Infrastructure/exception-handler/ApiExceptionMapping';
import { HttpStatusCode } from 'src/SharedKernel/Infrastructure/HttpResponse';
import { TypeormProductRepository } from '../..';
import {
  ProductFindById,
  ProductFindByIdInputPort,
  ProductFindByIdOutputPort,
} from '../../../Application/Find';
import { Product, ProductId, ProductNotExist } from '../../../Domain';
import { ProductIdGetRequestValidator } from './ProductIdGetRequestValidator';

interface ProductIdGetParams {
  productId: string;
}

export interface ProductIdGetRequest {
  readonly params: ProductIdGetParams;
}

export class ProductIdGetResponse implements SuccessResponse {
  public readonly status = StatusType.SUCCESS;
  public readonly data: {
    product: {
      id: string;
      name: string;
      description: string;
    };
  };

  constructor(product: Product) {
    this.data = {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
      },
    };
  }
}

export class ProductIdGetApiPresenter
  implements ProductFindByIdOutputPort<ProductIdGetResponse>
{
  show({ product }: { product: Product }): ProductIdGetResponse {
    return new ProductIdGetResponse(product);
  }
}

@Controller()
export class ProductIdGetController extends ApiController {
  constructor(
    private readonly _unitOfWorkService: UnitOfWork,
    exceptionHandler: ApiExceptionMapping,
    apiExceptionListener: ApiExceptionListener,
  ) {
    super(exceptionHandler, apiExceptionListener);
  }

  @Get(':productId')
  async run(
    @Res() response: Response,
    @Param('productId') productId: ProductIdGetParams['productId'],
  ): Promise<Response> {
    try {
      const { params } = ProductIdGetRequestValidator({
        params: { productId },
      });

      const productRepository = new TypeormProductRepository(
        this._unitOfWorkService.manager,
      );

      const productFindByIdInputPort: ProductFindByIdInputPort = {
        productId: new ProductId(params.productId),
      };

      const productFindByIdApiPresenter = new ProductIdGetApiPresenter();

      const productFindById = new ProductFindById(
        productRepository,
        productFindByIdApiPresenter,
      );

      const result = await this._unitOfWorkService.transaction(
        async () => await productFindById.execute(productFindByIdInputPort),
      );

      return response.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      const err = error instanceof Error ? error : new Error();

      const { code, exceptionResponse } =
        this.apiExceptionListener.onException(err);

      return response.status(code).json(exceptionResponse);
    }
  }

  protected exceptions(): ExceptionMapping {
    return {
      [ProductNotExist.name]: {
        code: HttpStatusCode.NotFound,
        type: StatusType.FAIL,
      },
    };
  }
}
