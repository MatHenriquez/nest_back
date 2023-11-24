import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../../application/services/user.service';

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

  const mockUser = {
    id: 1,
    nickName: 'John Doe',
    email: 'john.doe@mail.com',
    password: '123',
  };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findBy: jest.fn(),
    findAndUpdate: jest.fn(),
    findAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('User controller', () => {
    describe('Success cases', () => {
      it('Should create a user', async () => {
        mockUserService.create = jest.fn().mockResolvedValue(mockUser);

        const createdUser = await userController.create(mockUser);

        expect(mockUserService.create).toHaveBeenCalledWith(mockUser);
        expect(createdUser).toEqual(mockUser);
      });

      it('Should find all users', async () => {
        mockUserService.findAll = jest.fn().mockResolvedValue(mockUsers);

        const foundUsers = await userController.findAll();

        expect(mockUserService.findAll).toHaveBeenCalled();
        expect(foundUsers).toEqual(mockUsers);
      });

      it('Should find an user by id', async () => {
        mockUserService.findBy = jest.fn().mockResolvedValue(mockUser);

        const foundUser = await userController.findOne('1');

        expect(mockUserService.findBy).toHaveBeenCalledWith({ id: 1 });
        expect(foundUser).toEqual(mockUser);
      });

      it('Should update an user', async () => {
        mockUserService.findAndUpdate = jest.fn().mockResolvedValue(mockUser);

        const updatedUser = await userController.update('1', mockUser);

        expect(mockUserService.findAndUpdate).toHaveBeenCalledWith(1, mockUser);
        expect(updatedUser).toEqual(mockUser);
      });

      it('Should delete an user', async () => {
        mockUserService.findAndDelete = jest.fn().mockResolvedValue(mockUser);

        const deletedUser = await userController.remove('1');

        expect(mockUserService.findAndDelete).toHaveBeenCalledWith(1);
        expect(deletedUser).toEqual(mockUser);
      });
    });
    describe('Error cases', () => {
      it('Should throw an error when creating an user with invalid email', async () => {
        const mockInvalidUser = {
          nickName: 'John Doe',
          email: 'not_an_email',
          password: '123',
        };

        mockUserService.create = jest
          .fn()
          .mockRejectedValue(new Error('Invalid user'));

        await expect(userController.create(mockInvalidUser)).rejects.toThrow(
          'Invalid user',
        );
        expect(mockUserService.create).toHaveBeenCalledWith(mockInvalidUser);
      });

      it('Should throw an error when creating an user with a nickname to short', () => {
        const mockInvalidUser = {
          nickName: 'J',
          email: 'john@mail.com',
          password: '123',
        };
        const mockError = new Error(
          'Nickname should have at least 6 characters',
        );
        mockUserService.create = jest.fn().mockRejectedValue(mockError);

        expect(userController.create(mockInvalidUser)).rejects.toThrowError(
          mockError,
        );
        expect(mockUserService.create).toHaveBeenCalledWith(mockInvalidUser);
      });

      it('Should throw an error when creating an user with a nickname to long', () => {
        const mockInvalidUser = {
          nickName: 'J1234567890121212',
          email: 'john@mail.com',
          password: '123',
        };
        const mockError = new Error(
          'Nickname should have at most 12 characters',
        );
        mockUserService.create = jest.fn().mockRejectedValue(mockError);

        expect(userController.create(mockInvalidUser)).rejects.toThrowError(
          mockError,
        );
        expect(mockUserService.create).toHaveBeenCalledWith(mockInvalidUser);
      });

      it('Should throw an error when searching for a user with no parameters', () => {
        const mockError = new Error('Missing fields');
        mockUserService.findBy = jest.fn().mockRejectedValue(mockError);

        expect(userController.findOne('')).rejects.toThrowError(mockError);
        expect(mockUserService.findBy).toHaveBeenCalledWith({ id: 0 });
      });

      it('Should throw an error when searching for a user with invalid parameters', () => {
        const mockError = new Error('Invalid fields');
        mockUserService.findBy = jest.fn().mockRejectedValue(mockError);

        expect(userController.findOne('invalid_id')).rejects.toThrowError(
          mockError,
        );
        expect(mockUserService.findBy).toHaveBeenCalledWith({ id: NaN });
      });

      it('Should throw an error when searching for a user that does not exist', () => {
        const mockError = new Error('User not found');
        mockUserService.findBy = jest.fn().mockRejectedValue(mockError);

        expect(userController.findOne('999999')).rejects.toThrowError(
          mockError,
        );
        expect(mockUserService.findBy).toHaveBeenCalledWith({ id: 999999 });
      });

      it('Should throw an error when updating a user that does not exist', () => {
        const mockError = new Error('User not found');
        mockUserService.findAndUpdate = jest.fn().mockRejectedValue(mockError);

        expect(userController.update('999999', mockUser)).rejects.toThrowError(
          mockError,
        );
        expect(mockUserService.findAndUpdate).toHaveBeenCalledWith(
          999999,
          mockUser,
        );
      });

      it('Should throw an error when updatingt a user with invalid info', () => {
        const mockInvalidUser = {
          nickName: 'John Doe',
          email: 'not_an_email',
          password: '123',
        };
        const mockError = new Error('Invalid email');
        mockUserService.findAndUpdate = jest.fn().mockRejectedValue(mockError);

        expect(
          userController.update('1', mockInvalidUser),
        ).rejects.toThrowError(mockError);
        expect(mockUserService.findAndUpdate).toHaveBeenCalledWith(
          1,
          mockInvalidUser,
        );
      });

      it('Should throw an error when deleting a user that does not exist', () => {
        const mockError = new Error('User not found');
        mockUserService.findAndDelete = jest.fn().mockRejectedValue(mockError);

        expect(userController.remove('999999')).rejects.toThrowError(mockError);
        expect(mockUserService.findAndDelete).toHaveBeenCalledWith(999999);
      });
    });
  });
});
