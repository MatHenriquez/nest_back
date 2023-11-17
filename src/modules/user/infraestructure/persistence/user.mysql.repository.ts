import { Body } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../../application/dtos';
import type { Repository } from 'typeorm';
import {
  checkIfUserAlreadyExists,
  checkIfUserExists,
  checkIfIsCreateBodyValid,
  checkIfIsUpdateBodyValid,
} from '../utils/user-validations';
import { throwRepositoryException } from '../utils/repository-exceptions';
import { RepositoryErrorsMessages } from '../errors/repository-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/models/user.entity';

export class UserMySqlRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(@Body() user: CreateUserDto) {
    checkIfIsCreateBodyValid(user.nickName, user.email, user.password);
    const userFound = await this.userRepository.findOne({
      where: { email: user.email },
    });

    await checkIfUserAlreadyExists(userFound);

    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throwRepositoryException(RepositoryErrorsMessages.CREATE_ERROR, error);
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throwRepositoryException(RepositoryErrorsMessages.FIND_ALL_ERROR, error);
    }
  }

  async findById(id: number) {
    try {
      await this.checkIfUserCanBeFound(id);
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throwRepositoryException(RepositoryErrorsMessages.FIND_ERROR, error);
    }
  }

  async update(id: number, updateUser: UpdateUserDto) {
    checkIfIsUpdateBodyValid(
      updateUser.nickName,
      updateUser.email,
      updateUser.password,
    );

    await this.checkIfUserCanBeFound(id);

    try {
      return await this.userRepository.update({ id }, updateUser);
    } catch (error) {
      throwRepositoryException(RepositoryErrorsMessages.UPDATE_ERROR, error);
    }
  }

  async remove(id: number) {
    await this.checkIfUserCanBeFound(id);

    try {
      await this.userRepository.delete({ id });
    } catch (error) {
      throwRepositoryException(RepositoryErrorsMessages.DELETE_ERROR, error);
    }
    return { message: 'User deleted successfully' };
  }

  private async checkIfUserCanBeFound(id: number) {
    try {
      const userFound = await this.userRepository.findOneBy({ id });
      await checkIfUserExists(userFound);
    } catch (error) {
      throwRepositoryException(RepositoryErrorsMessages.FIND_ERROR, error);
    }
  }
}
