import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { UserController } from './controller/user.controller';
import { UserMySqlRepository } from './infraestructure/persistence/user.mysql.repository';
import { UserService } from './application/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserMySqlRepository, UserService],
})
export class UserModule {}
