import { UserRepositoryModel } from '../../../domain/models/user-repository.model';

export interface IUserRepository {
  create: (user: UserRepositoryModel) => Promise<UserRepositoryModel>;
  findAll: () => Promise<UserRepositoryModel[]>;
  findBy: ({
    id,
    email,
  }: {
    id?: number;
    email?: string;
  }) => Promise<UserRepositoryModel>;
  findAndUpdate: (
    id: number,
    user: UserRepositoryModel,
  ) => Promise<UserRepositoryModel>;
  findAndDelete: (id: number) => Promise<UserRepositoryModel>;
}

export interface IUser {
  id: number;
  nickName: string;
  email: string;
  password: string;
  deletedAt?: Date;
}

export interface IGetUser extends IUser {
  id: number;
}

export interface IUpdateUser {
  nickName?: string;
  email?: string;
  password?: string;
  deletedAt?: Date;
}
