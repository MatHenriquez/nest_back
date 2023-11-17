import { Test, TestingModule } from '@nestjs/testing';
import { UserMySqlRepository } from '../user.mysql.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../domain/models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../../../application/dtos';

describe('User Repository', () => {
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  const mockUsers = [
    {
      id: 1,
      nickName: 'John Doe',
      email: 'john.doe@mail.com',
      password: '123',
    },
    {
      id: 2,
      nickName: 'Jane Doe',
      email: 'jane.doe@mail.com',
      password: '123',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMySqlRepository,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((user: CreateUserDto) => {
              const newUser = { ...user, id: mockUsers.length + 1 };
              mockUsers.push(newUser);
              return newUser;
            }),
            find: jest.fn(() => mockUsers),
            findOneBy: jest.fn(
              ({ id }) => mockUsers.filter((u) => u.id === id)[0],
            ),
            update: jest.fn(({ id }, user: UpdateUserDto) => {
              const userFound = mockUsers.filter((u) => u.id === id)[0];
              const updatedUser = { ...userFound, ...user };
              mockUsers.splice(id - 1, 1, updatedUser);
              return { updatedUser };
            }),
            delete: jest.fn(({ id }) => {
              const userFound = mockUsers.filter((u) => u.id === id)[0];
              mockUsers.splice(id - 1, 1);
              return userFound;
            }),
          },
        },
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  describe('User repository', () => {
    it('Should create a user', () => {
      const createdUser = userRepository.create(mockUsers[0]);
      expect(createdUser).toEqual(mockUsers[mockUsers.length - 1]);
    });

    it('Should find all users', () => {
      const users = userRepository.find();
      expect(users).toEqual(mockUsers);
    });

    it('Should find a user by id', () => {
      const user = userRepository.findOneBy({ id: 1 });
      expect(user).toEqual(mockUsers[0]);
    });

    it("Should throw an error if user doesn't exist", () => {
      const user = userRepository.findOneBy({ id: 300 });
      expect(user).toBeUndefined();
    });

    it("Should update a user's data", () => {
      const user = userRepository.findOneBy({ id: 1 });
      const updatedUser = { ...user, nickName: 'John Doe Updated' };
      const updated = userRepository.update({ id: 1 }, updatedUser);
      expect(updated).toEqual({ updatedUser });
    });

    it("Should remove a user's data", () => {
      const user = userRepository.findOneBy({ id: 1 });
      const removed = userRepository.delete({ id: 1 });
      expect(removed).toEqual(user);
    });
  });
});
