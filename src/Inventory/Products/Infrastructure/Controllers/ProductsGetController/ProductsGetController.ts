import { Controller, Get, Res } from '@nestjs/common';
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
  ProductFindAll,
  ProductFindAllOutputPort,
} from '../../../Application/Find';
import { Product } from '../../../Domain';

export class ProductGetResponse implements SuccessResponse {
  public readonly status = StatusType.SUCCESS;
  public readonly data: {
    products: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  } = { products: [] };

  constructor(products: Product[]) {
    this.data.products = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
    }));
  }
}

export class ProductsGetApiPresenter
  implements ProductFindAllOutputPort<ProductGetResponse>
{
  show({
    productCollection,
  }: {
    productCollection: Product[];
  }): ProductGetResponse {
    return new ProductGetResponse(productCollection);
  }
}

@Controller()
export class ProductsGetController extends ApiController {
  constructor(
    private readonly _unitOfWorkService: UnitOfWork,
    exceptionHandler: ApiExceptionMapping,
    apiExceptionListener: ApiExceptionListener,
  ) {
    super(exceptionHandler, apiExceptionListener);
  }

  @Get()
  async run(@Res() response: Response): Promise<Response> {
    try {
      const productRepository = new TypeormProductRepository(
        this._unitOfWorkService.manager,
      );

      const productFindAllRestPresenter = new ProductsGetApiPresenter();

      const productFindAll = new ProductFindAll(
        productRepository,
        productFindAllRestPresenter,
      );

      const result = await this._unitOfWorkService.transaction(async () => {
        return await productFindAll.execute();
      });

      return response.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      const { code, exceptionResponse } =
        this.apiExceptionListener.onException(error);

      return response.status(code).json(exceptionResponse);
    }
  }

  protected exceptions(): ExceptionMapping {
    return {};
  }
}
