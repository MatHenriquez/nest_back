export interface IRepositoryErrors {
  CREATE_ERROR: string;
  UPDATE_ERROR: string;
  DELETE_ERROR: string;
  FIND_ERROR: string;
  FIND_ALL_ERROR: string;
}

export interface IUserErrors {
  USER_ALREADY_EXISTS: string;
  USER_NOT_FOUND: string;
  MISSING_FIELDS: string;
  INVALID_BODY_TYPE: string;
}
