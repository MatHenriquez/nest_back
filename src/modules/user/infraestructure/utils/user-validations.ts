import type { User } from '../../domain/models/user.entity';
import {
  InvalidBodyType,
  MissingFields,
  UserAlreadyExists,
  UserNotFound,
} from '../errors/user-errors';

export const checkIfUserAlreadyExists = async (user: User | undefined) => {
  if (user) throw new UserAlreadyExists();
};

export const checkIfUserExists = async (user: User | undefined) => {
  if (!user) throw new UserNotFound();
};

export const checkIfIsCreateBodyValid = (
  nickName?: any,
  email?: any,
  password?: any,
) => {
  if (!email || !password) throw new MissingFields();
  checkIfIsBodyValid(nickName, email, password);
};

export const checkIfIsUpdateBodyValid = (
  nickName?: any,
  email?: any,
  password?: any,
) => {
  if (!email && !password && !nickName) throw new MissingFields();
  checkIfIsBodyValid(nickName, email, password);
};

const checkIfIsBodyValid = (nickName?: any, email?: any, password?: any) => {
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof nickName !== 'string'
  )
    throw new InvalidBodyType();
};
