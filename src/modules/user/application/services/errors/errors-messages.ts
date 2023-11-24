import type { IControllerErrors } from '../../interfaces/application/ErrorInterfaces';

export const ErrorsMessages: IControllerErrors = {
  CREATE_ERROR: 'Error creating user',
  UPDATE_ERROR: 'Error updating user',
  DELETE_ERROR: 'Error deleting user',
  FIND_ERROR: 'Error finding user',
  FIND_ALL_ERROR: 'Error finding all users',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  MISSING_FIELDS: 'Missing fields',
  INVALID_BODY_TYPE: 'Invalid body type',
};
