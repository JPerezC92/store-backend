import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/SharedKernel/Infrastructure/database/database.module';
import { ExceptionHandlerModule } from 'src/SharedKernel/Infrastructure/exception-handler/exception-handler.module';
import { ProductIdDeleteController } from './Controllers/ProductIdDeleteController/ProductIdDeleteController';
import { ProductIdGetController } from './Controllers/ProductIdGetController/ProductIdGetController';
import { ProductsGetController } from './Controllers/ProductsGetController/ProductsGetController';
import { ProductsPostController } from './Controllers/ProductsPostController/ProductsPostController';

@Module({
  imports: [DatabaseModule, ExceptionHandlerModule],
  controllers: [
    ProductsPostController,
    ProductsGetController,
    ProductIdGetController,
    ProductIdDeleteController,
  ],
})
export class ProductsModule {}
