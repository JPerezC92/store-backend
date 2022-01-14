import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { InventoryModule } from './Inventory/inventory.module';

@Module({
  imports: [
    InventoryModule,
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
  ],
  controllers: [AppController],
})
export class AppModule {}
