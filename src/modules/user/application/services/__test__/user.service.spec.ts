import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserMySqlRepository } from '../../../infraestructure/persistence/user.mysql.repository';
import { IUserRepository } from '../../interfaces/infraestructure/user.interface';
import { ResponseDto, UserCreateDto } from '../../dto/user.dto';
import { UserRepositoryModel } from 'src/modules/user/domain/models/user-repository.model';

describe('User Service', () => {
  let userService: UserService;

  let mockUserRepository: IUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findBy: jest.fn(),
    findAndUpdate: jest.fn(),
    findAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findBy: jest.fn(),
      findAndUpdate: jest.fn(),
      findAndDelete: jest.fn(),
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserMySqlRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('User service', () => {
    describe('Success cases', () => {
      it('Should create a user', async () => {
        const mockUserCreate: UserCreateDto = {
          nickName: 'John Doe',
          email: 'john.doe@mail.com',
          password: '123',
        };
        const mockCreatedUser: UserRepositoryModel = {
          ...mockUserCreate,
        };
        const mockResponseDto: ResponseDto = {
          message:
            'User with email: john.doe@mail.com has been created successfully',
          user: mockCreatedUser,
        };
        mockUserRepository.create = jest
          .fn()
          .mockResolvedValue(mockCreatedUser);

        const createdUser = await userService.create(mockUserCreate);

        expect(mockUserRepository.create).toHaveBeenCalledWith(mockCreatedUser);
        expect(createdUser).toEqual(mockResponseDto);
      });

      it('Should find all users', async () => {
        const mockFoundUsers: UserRepositoryModel[] = [
          {
            id: 1,
            nickName: 'John Doe',
            email: 'john@mail.com',
            password: '123',
          },
          {
            id: 2,
            nickName: 'Jane Doe',
            email: 'jane@mail.com',
            password: '123',
          },
        ];
        mockUserRepository.findAll = jest
          .fn()
          .mockResolvedValue(mockFoundUsers);

        const foundUsers = await userService.findAll();

        expect(mockUserRepository.findAll).toHaveBeenCalled();
        expect(foundUsers).toEqual(mockFoundUsers);
      });

      it('Should find an user by id', async () => {
        const mockFoundUser = {
          id: 1,
          email: 'j.doe@mail.com',
          nickName: 'John Doe',
        };
        const mockFoundUserResponse = {
          message:
            'User with email: j.doe@mail.com has been found successfully',
          user: mockFoundUser,
        };
        mockUserRepository.findBy = jest.fn().mockResolvedValue(mockFoundUser);

        const foundUser = await userService.findBy({ id: 1 });

        expect(mockUserRepository.findBy).toHaveBeenCalledWith({ id: 1 });
        expect(foundUser).toEqual(mockFoundUserResponse);
      });

      it('Should update an user', async () => {
        const mockUpdateUser = {
          nickName: 'John Doe',
          email: 'jh.doe@mail.com',
          password: '123',
        };
        const mockUpdateResponse = {
          message:
            'User with email: jh.doe@mail.com has been updated successfully',
          user: {
            nickName: 'John Doe',
            email: 'jh.doe@mail.com',
            password: '123',
          },
        };
        mockUserRepository.findAndUpdate = jest
          .fn()
          .mockResolvedValue(mockUpdateUser);

        const updatedUser = await userService.findAndUpdate(1, mockUpdateUser);

        expect(mockUserRepository.findAndUpdate).toHaveBeenCalledWith(
          1,
          mockUpdateUser,
        );
        expect(updatedUser).toEqual(mockUpdateResponse);
      });

      it('Should delete an user', async () => {
        const mockDeletedUser = {
          nickName: 'John Doe',
          email: 'jh.doe@mail.com',
          password: '123',
        };
        const mockDeleteUserResponse = {
          message:
            'User with email: jh.doe@mail.com has been deleted successfully',
          user: {
            nickName: 'John Doe',
            email: 'jh.doe@mail.com',
            password: '123',
          },
        };
        mockUserRepository.findAndDelete = jest
          .fn()
          .mockResolvedValue(mockDeletedUser);

        const deletedUser = await userService.findAndDelete(1);

        expect(deletedUser).toEqual(mockDeleteUserResponse);
      });
    });
  });

  describe('Error cases', () => {
    it('Should throw an error when creating an user with an invalid email', async () => {
      const mockInvalidUser: UserCreateDto = {
        nickName: 'John Doe',
        email: 'not_an_email',
        password: '123',
      };
      const mockError = new Error('Invalid email');
      mockUserRepository.create = jest.fn().mockRejectedValue(mockError);

      await expect(userService.create(mockInvalidUser)).rejects.toThrowError(
        mockError,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(mockInvalidUser);
    });

    it('Should throw an error when creating an user with a nickname to short', async () => {
      const mockInvalidUser: UserCreateDto = {
        nickName: 'J',
        email: 'john@mail.com',
        password: '123',
      };
      const mockError = new Error('Nickname should have at least 6 characters');
      mockUserRepository.create = jest.fn().mockRejectedValue(mockError);

      await expect(userService.create(mockInvalidUser)).rejects.toThrowError(
        mockError,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(mockInvalidUser);
    });

    it('Should throw an error when creating an user with a nickname to long', async () => {
      const mockInvalidUser = {
        nickName: 'J1234567890121212',
        email: 'john@mail.com',
        password: '123',
      };
      const mockError = new Error('Nickname should have at most 12 characters');
      mockUserRepository.create = jest.fn().mockRejectedValue(mockError);

      await expect(userService.create(mockInvalidUser)).rejects.toThrowError(
        mockError,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(mockInvalidUser);
    });

    it('Should throw an error when searching for a user with no parameters', async () => {
      const mockError = new Error('Missing fields');
      mockUserRepository.findBy = jest.fn().mockRejectedValue(mockError);

      await expect(userService.findBy({})).rejects.toThrowError(mockError);
      expect(mockUserRepository.findBy).not.toHaveBeenCalled();
    });

    it('Should throw an error when searching for a user with invalid parameters', async () => {
      const mockError = new Error('Invalid fields');
      mockUserRepository.findBy = jest.fn().mockRejectedValue(mockError);
      const invalidParams = { email: 'not_an_email' };

      await expect(userService.findBy(invalidParams)).rejects.toThrowError(
        mockError,
      );
      expect(mockUserRepository.findBy).toHaveBeenCalledWith(invalidParams);
    });

    it('Should throw an error when searching for a user that does not exist', async () => {
      const mockError = new Error('User not found');
      mockUserRepository.findBy = jest.fn().mockRejectedValue(mockError);
      const unexistingId = { id: 999999 };

      await expect(userService.findBy(unexistingId)).rejects.toThrowError(
        mockError,
      );
      expect(mockUserRepository.findBy).toHaveBeenCalledWith(unexistingId);
    });

    it('Should throw an error when updating a user that does not exist', async () => {
      const mockError = new Error('User not found');
      mockUserRepository.findAndUpdate = jest.fn().mockRejectedValue(mockError);
      const unexistingId = 999999;
      const mockUpdateUser = {
        nickName: 'John Doe',
        email: 'jh.doe@mail.com',
        password: '123',
      };

      await expect(
        userService.findAndUpdate(unexistingId, mockUpdateUser),
      ).rejects.toThrowError(mockError);
      expect(mockUserRepository.findAndUpdate).toHaveBeenCalledWith(
        unexistingId,
        mockUpdateUser,
      );
    });

    it('Should throw an error when updatingt a user with invalid info', async () => {
      const mockError = new Error('Invalid email');
      mockUserRepository.findAndUpdate = jest.fn().mockRejectedValue(mockError);
      const invalidUpdateUser = {
        nickName: 'John Doe',
        email: 'not_an_email',
        password: '123',
      };

      await expect(
        userService.findAndUpdate(1, invalidUpdateUser),
      ).rejects.toThrowError(mockError);
      expect(mockUserRepository.findAndUpdate).toHaveBeenCalledWith(
        1,
        invalidUpdateUser,
      );
    });

    it('Should throw an error when deleting a user that does not exist', async () => {
      const mockError = new Error('User not found');
      mockUserRepository.findAndDelete = jest.fn().mockRejectedValue(mockError);
      const unexistingId = 999999;

      await expect(
        userService.findAndDelete(unexistingId),
      ).rejects.toThrowError(mockError);
      expect(mockUserRepository.findAndDelete).toHaveBeenCalledWith(
        unexistingId,
      );
    });
  });
});
