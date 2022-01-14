import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ProductsModule } from './Products/Infrastructure';

@Module({
  imports: [
    ProductsModule,
    RouterModule.register([
      {
        path: 'inventory',
        module: InventoryModule,
        children: [{ path: 'products', module: ProductsModule }],
      },
    ]),
  ],
})
export class InventoryModule {}
