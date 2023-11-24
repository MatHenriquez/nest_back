import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm-config';
import { UserModule } from './modules/user/user.module';
import { MySqlTypeOrmClient } from './config/MySqlTypeOrm.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
    }),
    MySqlTypeOrmClient.create(),
    UserModule,
  ],
})
export class AppModule {}
