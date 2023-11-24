import {
  IsInt,
  IsString,
  Length,
  IsEmail,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UserEntity {
  @IsInt()
  id: number;
  @IsString()
  @Length(6, 12)
  nickName: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
