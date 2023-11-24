import {
  ResponseUserDto,
  ResponseDto,
  UserCreateDto,
  UserUpdateDto,
} from '../../dto/user.dto';

export interface IUserService {
  create(user: UserCreateDto): Promise<ResponseDto>;
  findAll(): Promise<ResponseUserDto[]>;
  findBy({ id, email }: { id?: number; email?: string }): Promise<ResponseDto>;
  findAndUpdate(id: number, user: UserUpdateDto): Promise<ResponseDto>;
  findAndDelete(id: number): Promise<ResponseDto>;
}
