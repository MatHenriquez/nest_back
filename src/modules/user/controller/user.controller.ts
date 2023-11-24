import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Inject,
} from '@nestjs/common';
import { UserService } from '../application/services/user.service';
import { IUserService } from '../application/interfaces/application/user-service.interface';
import { UserCreateDto, UserUpdateDto } from '../application/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService) private readonly _userService: IUserService,
  ) {}

  @Post()
  create(@Body() newUser: UserCreateDto) {
    return this._userService.create(newUser);
  }

  @Get()
  findAll() {
    return this._userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._userService.findBy({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UserUpdateDto) {
    return this._userService.findAndUpdate(+id, updateUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._userService.findAndDelete(+id);
  }
}
