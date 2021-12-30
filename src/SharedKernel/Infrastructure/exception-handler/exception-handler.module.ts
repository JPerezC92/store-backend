import { Module } from '@nestjs/common';
import { ApiExceptionListener } from './ApiExceptionListener';
import { ApiExceptionMapping } from './ApiExceptionMapping';

@Module({
  providers: [ApiExceptionMapping, ApiExceptionListener],
  exports: [ApiExceptionMapping, ApiExceptionListener],
})
export class ExceptionHandlerModule {}
