import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constant } from 'src/SharedKernel/Constant';
import { EnvVar, TEnvVar } from 'src/SharedKernel/Infrastructure/EnvVar';
import { NodeEnv } from 'src/SharedKernel/NodeEnv.type';
import { UnitOfWork } from './unitOfWork.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService<TEnvVar>) {
        const NODE_ENV = configService.get<NodeEnv>(EnvVar.NODE_ENV);
        // console.log(NODE_ENV);
        return {
          type: 'postgres',
          host: configService.get(EnvVar.DATABASE_HOST),
          port: configService.get(EnvVar.DATABASE_PORT),
          username: configService.get(EnvVar.DATABASE_USERNAME),
          password: configService.get(EnvVar.DATABASE_PASSWORD),
          database: configService.get(EnvVar.DATABASE_NAME),
          // entities: [__dirname + '/../**/*.model{.ts,.js}'],
          entities: [__dirname + '/../../../**/*.schema{.ts,.js}'],
          synchronize: NODE_ENV !== Constant.PRODUCTION,
          logging: NODE_ENV !== Constant.PRODUCTION,
          ssl: NODE_ENV === Constant.PRODUCTION,
          extra: NODE_ENV === Constant.PRODUCTION && {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
  ],
  exports: [UnitOfWork],
  providers: [UnitOfWork],
})
export class DatabaseModule {}
