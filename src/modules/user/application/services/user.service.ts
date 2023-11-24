import { Inject, Injectable } from '@nestjs/common';
import { UserMySqlRepository } from '../../infraestructure/persistence/user.mysql.repository';
import { IUserRepository } from '../interfaces/infraestructure/user.interface';
import { IUserService } from '../interfaces/application/user-service.interface';
import { responseMessages } from '../helpers/responseMessages';
import { ACTION } from '../helpers/actionConstant';
import { ResponseDto, UserCreateDto, UserUpdateDto } from '../dto/user.dto';
import { UserRepositoryModel } from '../../domain/models/user-repository.model';
import {
  MissingFields,
  ServerError,
  UserAlreadyExists,
  UserNotFound,
} from './errors/user-errors';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserMySqlRepository)
    private readonly UserRepository: IUserRepository,
  ) {}

  async create(user: UserCreateDto): Promise<ResponseDto> {
    const newUser: UserRepositoryModel = {
      ...user,
    };

    try {
      const existingUser = await this.UserRepository.findBy({
        email: newUser.email,
      });
      if (existingUser) throw new UserAlreadyExists();
      const savedUser: UserRepositoryModel =
        await this.UserRepository.create(newUser);
      return {
        message: responseMessages(savedUser.email, ACTION.CREATED),
        user: {
          ...savedUser,
        },
      };
    } catch (error) {
      throw new ServerError(error.message, error.status);
    }
  }

  async findAll() {
    try {
      const allUsers = await this.UserRepository.findAll();
      return allUsers.map((user) => ({
        ...user,
      }));
    } catch (error) {
      throw new ServerError(error, error.status);
    }
  }

  async findBy({ id, email }: { id?: number; email?: string }) {
    let user: UserRepositoryModel;
    try {
      if (id) user = await this.UserRepository.findBy({ id });
      else if (email) user = await this.UserRepository.findBy({ email });
      else throw new MissingFields();
      if (!user) throw new UserNotFound();
      return {
        message: responseMessages(user.email, ACTION.FOUND),
        user: {
          ...user,
        },
      };
    } catch (error) {
      throw new ServerError(error.message, error.status);
    }
  }

  async findAndUpdate(id: number, user: UserUpdateDto) {
    const userToUpdate: UserRepositoryModel = {
      nickName: user.nickName,
      email: user.email,
      password: user.password,
    };

    try {
      const updatedUser = await this.UserRepository.findAndUpdate(
        id,
        userToUpdate,
      );
      if (!updatedUser) throw new UserNotFound();
      return {
        message: responseMessages(updatedUser.email, ACTION.UPDATED),
        user: {
          ...updatedUser,
        },
      };
    } catch (error) {
      throw new ServerError(error.message, error.status);
    }
  }

  async findAndDelete(id: number) {
    try {
      const deletedUser = await this.UserRepository.findAndDelete(id);
      if (!deletedUser) throw new UserNotFound();
      return {
        message: responseMessages(deletedUser.email, ACTION.DELETED),
        user: {
          ...deletedUser,
        },
      };
    } catch (error) {
      throw new ServerError(error.message, error.status);
    }
  }
}
