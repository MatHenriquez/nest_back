import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import TypeOrmConfig from './orm-config';

export class MySqlTypeOrmClient {
  static create() {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      ...TypeOrmConfig(),
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      synchronize: true,
    });
  }
}
