import { HttpException, HttpStatus } from '@nestjs/common';

export const throwRepositoryException = (
  errorMessage: string,
  error: Error,
) => {
  console.error(error);
  throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
};
