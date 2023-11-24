import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user-entity';
import { IUserRepository } from '../../application/interfaces/infraestructure/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepositoryModel } from '../../domain/models/user-repository.model';

@Injectable()
export class UserMySqlRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserRepositoryModel) {
    this.userRepository.create(newUser);
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findBy({ id, email }: { id?: number; email?: string }) {
    if (id) return await this.userRepository.findOne({ where: { id } });
    else if (email)
      return await this.userRepository.findOne({ where: { email } });
  }

  async findAndUpdate(id: number, user: UserRepositoryModel) {
    const userToUpdate = await this.findBy({ id });
    if (user.nickName) userToUpdate.nickName = user.nickName;
    if (user.email) userToUpdate.email = user.email;
    if (user.password) userToUpdate.password = user.password;
    await this.userRepository.save(userToUpdate);
    return userToUpdate;
  }

  async findAndDelete(id: number) {
    const userToDelete = await this.findBy({ id });
    await this.userRepository.softDelete(id);
    return userToDelete;
  }
}
