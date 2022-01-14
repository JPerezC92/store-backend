import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import {
  ApiExceptionMapping,
  ExceptionMapping,
} from 'src/SharedKernel/Infrastructure/exception-handler/ApiExceptionMapping';
import {
  ProductDelete,
  ProductDeleteOutputPort,
} from '../../../Application/Remove/ProductDelete';
import { ApiController } from 'src/SharedKernel/Infrastructure/ApiController';
import { ApiExceptionListener } from 'src/SharedKernel/Infrastructure/exception-handler/ApiExceptionListener';
import { HttpStatusCode } from 'src/SharedKernel/Infrastructure/HttpResponse';
import { ProductId, ProductNotExist } from '../../../Domain';
import { ProductIdDeleteValidator } from './ProductIdDeleteValidator';
import { StatusType, SuccessResponse } from 'src/SharedKernel/Infrastructure';
import { TypeormProductRepository } from '../..';
import { UnitOfWork } from 'src/SharedKernel/Infrastructure/database/unitOfWork.service';

interface ProductIdDeleteParams {
  readonly productId: string;
}

export class ProductIdDeleteRequest {
  readonly params: ProductIdDeleteParams;
}

export class ProductIdDeleteResponse implements SuccessResponse {
  public readonly status = StatusType.SUCCESS;
  public readonly data = null;
}

export class ProductDeleteApiPresenter
  implements ProductDeleteOutputPort<ProductIdDeleteResponse>
{
  show(): ProductIdDeleteResponse {
    return new ProductIdDeleteResponse();
  }
}

@Controller()
export class ProductIdDeleteController extends ApiController {
  constructor(
    private readonly _unitOfWorkService: UnitOfWork,
    exceptionHandler: ApiExceptionMapping,
    apiExceptionListener: ApiExceptionListener,
  ) {
    super(exceptionHandler, apiExceptionListener);
  }

  @Delete(':productId')
  async run(
    @Res() response: Response,
    @Param('productId') productId: string,
  ): Promise<Response> {
    try {
      const { params } = ProductIdDeleteValidator({
        params: { productId },
      });

      const productRepository = new TypeormProductRepository(
        this._unitOfWorkService.manager,
      );

      const productDeleteApiPresenter = new ProductDeleteApiPresenter();

      const productDelete = new ProductDelete(
        productRepository,
        productDeleteApiPresenter,
      );
      const result = await this._unitOfWorkService.transaction(
        async () =>
          await productDelete.execute({
            productId: new ProductId(params.productId),
          }),
      );

      return response.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      const { code, exceptionResponse } =
        this.apiExceptionListener.onException(error);

      return response.status(code).send(exceptionResponse);
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
