import {
  IsInt,
  IsString,
  Length,
  IsEmail,
  IsDate,
  IsOptional,
} from 'class-validator';
export class UserRepositoryModel {
  @IsOptional()
  @IsInt()
  id?: number;
  @IsString()
  @Length(6, 12)
  nickName: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsDate()
  createdAt?: Date;
  @IsOptional()
  updatedAt?: Date;
  @IsDate()
  deletedAt?: Date;
}
