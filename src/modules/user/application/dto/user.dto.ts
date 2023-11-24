import { IsEmail, IsInt, IsOptional, IsString, Length } from 'class-validator';

abstract class UserDto {
  @IsString()
  @Length(6, 12)
  nickName: string;
  @IsString()
  @IsEmail()
  email: string;
}

export class UserCreateDto extends UserDto {
  @IsString()
  password: string;
}

export class ResponseUserDto extends UserDto {
  @IsInt()
  id: number;
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @Length(6, 12)
  nickName?: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  password?: string;
}

export class ResponseDto {
  @IsString()
  message: string;
  @IsOptional()
  user?: UserDto;
}
