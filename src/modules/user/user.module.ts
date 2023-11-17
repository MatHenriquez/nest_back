import { Module } from '@nestjs/common';
import { UserMySqlRepository } from './infraestructure/persistence/user.mysql.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/models/user.entity';
import { UserController } from './infraestructure/user-crud.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserMySqlRepository],
})
export class UserModule {}
