import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ProductsModule } from './Storehouse/Products/Infrastructure';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
  ],
  controllers: [AppController],
})
export class AppModule {}
