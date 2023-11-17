import { HttpException, HttpStatus } from '@nestjs/common';
import type { IUserErrors } from './interfaces/ErrorInterfaces';

const UserErrorsMessages: IUserErrors = {
  USER_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  MISSING_FIELDS: 'Missing fields',
  INVALID_BODY_TYPE: 'Invalid body type: arguments should be strings',
};

export class UserAlreadyExists extends HttpException implements Error {
  constructor() {
    super(UserErrorsMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class UserNotFound extends HttpException implements Error {
  constructor() {
    super(UserErrorsMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class MissingFields extends HttpException implements Error {
  constructor() {
    super(UserErrorsMessages.MISSING_FIELDS, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidBodyType extends HttpException implements Error {
  constructor() {
    super(UserErrorsMessages.INVALID_BODY_TYPE, HttpStatus.BAD_REQUEST);
  }
}
