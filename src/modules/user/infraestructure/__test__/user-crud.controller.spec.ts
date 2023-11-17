import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user-crud.controller';
import { CreateUserDto, UpdateUserDto } from '../../application/dtos';

describe('User Controller', () => {
  let userController: UserController;

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

  const mockUserController = {
    create: jest.fn((user: CreateUserDto) => {
      const newUser = { ...user, id: mockUsers.length + 1 };
      mockUsers.push(newUser);
      return newUser;
    }),

    findAll: jest.fn(() => mockUsers),

    findOne: jest.fn(
      (id) => mockUsers.filter((u) => u.id.toString() === id)[0],
    ),

    update: jest.fn((id, user: UpdateUserDto) => {
      const userFound = mockUsers.filter((u) => u.id === id)[0];
      const updatedUser = { ...userFound, ...user };
      mockUsers.splice(id - 1, 1, updatedUser);
      return { updatedUser };
    }),

    remove: jest.fn((id) => {
      const userFound = mockUsers.filter((u) => u.id.toString() === id)[0];
      mockUsers.splice(id - 1, 1);
      return userFound;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserController,
          useValue: mockUserController,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('User controller', () => {
    it('Should create a user', () => {
      const createdUser = userController.create(mockUsers[0]);
      expect(createdUser).toEqual(mockUsers[mockUsers.length - 1]);
    });

    it('Should find all users', () => {
      const foundUsers = userController.findAll();
      expect(foundUsers).toEqual(mockUsers);
    });

    it('Should find a user by id', () => {
      const foundUser = userController.findOne('1');
      expect(foundUser).toEqual(mockUsers[0]);
    });

    it('Should update a user', () => {
      const updatedUser = userController.update(
        mockUsers[0].id.toString(),
        mockUsers[1],
      );
      expect(updatedUser).toEqual({ updatedUser: mockUsers[0] });
    });

    it('Should delete a user', () => {
      const deletedUser = userController.remove(mockUsers[0].id.toString());
      expect(deletedUser).toEqual(mockUsers[0]);
    });
  });
});
