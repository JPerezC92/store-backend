import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UnitOfWork } from 'src/SharedKernel/Infrastructure/database/unitOfWork.service';
import {
  JsUuidGenerator,
  StatusType,
  SuccessResponse,
} from 'src/SharedKernel/Infrastructure';
import { ApiController } from 'src/SharedKernel/Infrastructure/ApiController';
import { ApiExceptionListener } from 'src/SharedKernel/Infrastructure/exception-handler/ApiExceptionListener';
import {
  ApiExceptionMapping,
  ExceptionMapping,
} from 'src/SharedKernel/Infrastructure/exception-handler/ApiExceptionMapping';
import { HttpStatusCode } from 'src/SharedKernel/Infrastructure/HttpResponse';
import { TypeormProductRepository } from '../..';
import {
  ProductCreator,
  ProductCreatorInputPort,
  ProductCreatorOutputPort,
} from '../../../Application/Create';
import { ProductDescription, ProductId, ProductName } from '../../../Domain';
import { ProductsPostRequestValidator } from './ProductsPostRequestValidator';

export interface ProductsPostBody {
  readonly name: string;
  readonly description: string;
}

export interface ProductsPostRequest {
  body: ProductsPostBody;
}

export class ProductsPostResponse implements SuccessResponse {
  public readonly status = StatusType.SUCCESS;
  public readonly data = null;
}

export class ProductCreatorApiPresenter
  implements ProductCreatorOutputPort<ProductsPostResponse>
{
  show(): ProductsPostResponse {
    return new ProductsPostResponse();
  }
}

@Controller()
export class ProductsPostController extends ApiController {
  constructor(
    private readonly _unitOfWorkService: UnitOfWork,
    exceptionHandler: ApiExceptionMapping,
    apiExceptionListener: ApiExceptionListener,
  ) {
    super(exceptionHandler, apiExceptionListener);
  }

  @Post()
  async run(
    @Res() response: Response,
    @Body() productsPostBody: ProductsPostBody,
  ): Promise<Response> {
    try {
      const { body } = ProductsPostRequestValidator({
        body: productsPostBody,
      });

      const productRepository = new TypeormProductRepository(
        this._unitOfWorkService.manager,
      );

      const productCreatorRestPresenter = new ProductCreatorApiPresenter();

      const productCreator = new ProductCreator(
        productRepository,
        productCreatorRestPresenter,
      );

      const jsUuidGenerator = new JsUuidGenerator();

      const productCreatorInputPort: ProductCreatorInputPort = {
        id: new ProductId(jsUuidGenerator.generate()),
        name: new ProductName(body.name),
        description: new ProductDescription(body.description),
      };

      const result = await this._unitOfWorkService.transaction(
        async () => await productCreator.execute(productCreatorInputPort),
      );

      return response.status(HttpStatusCode.Created).json(result);
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
