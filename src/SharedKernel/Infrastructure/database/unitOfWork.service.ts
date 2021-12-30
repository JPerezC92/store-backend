import { Injectable } from '@nestjs/common';
import { Connection, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class UnitOfWork {
  private readonly _connection: Connection;
  private _queryRunner: QueryRunner;

  constructor(connection: Connection) {
    this._connection = connection;
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    try {
      await this._connect();
      await this._createTransaction();

      const result = await operation();

      await this._commit();

      return result;
    } catch (error) {
      await this._rollback();

      // if (error instanceof QueryFailedError) {
      //   throw new InternalServerErrorException(
      //     (error as QueryFailedError).message,
      //   );
      // }

      throw error;
    } finally {
      await this._queryRunner.release();
    }
  }

  private async _rollback(): Promise<void> {
    await this._queryRunner.rollbackTransaction();
  }

  private async _commit(): Promise<void> {
    await this._queryRunner.commitTransaction();
  }

  private async _createTransaction(): Promise<void> {
    await this._queryRunner.startTransaction();
  }

  private async _connect(): Promise<void> {
    await this._queryRunner.connect();
  }

  public get manager(): EntityManager {
    this._queryRunner = this._connection.createQueryRunner();
    return this._queryRunner.manager;
  }
}
