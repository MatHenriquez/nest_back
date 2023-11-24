import { UserEntity } from '../../../infraestructure/persistence/entities/user-entity';
import { UserRepositoryModel } from '../../..//domain/models/user-repository.model';

export interface IUserRepository {
  create(user: UserRepositoryModel): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findBy({ id, email }: { id?: number; email?: string }): Promise<UserEntity>;
  findAndUpdate(id: number, user: UserRepositoryModel): Promise<UserEntity>;
  findAndDelete(id: number): Promise<UserEntity>;
}
