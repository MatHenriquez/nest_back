import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorsMessages } from './errors-messages';

export class UserAlreadyExists extends HttpException implements Error {
  constructor() {
    super(ErrorsMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}

export class UserNotFound extends HttpException implements Error {
  constructor() {
    super(ErrorsMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class MissingFields extends HttpException implements Error {
  constructor() {
    super(ErrorsMessages.MISSING_FIELDS, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidBodyType extends HttpException implements Error {
  constructor(errorMessage: string) {
    super(errorMessage, HttpStatus.BAD_REQUEST);
  }
}

export class ServerError extends HttpException implements Error {
  constructor(errorMessage: string, errorStatus: number = 500) {
    super(errorMessage, errorStatus);
  }
}
