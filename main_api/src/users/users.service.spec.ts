import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { MongooseUtil } from 'src/common/util/mongoose.util';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { BadRequestException } from '@nestjs/common';


describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const user = { _id: '1', email: 'test@example.com', roles: [UserRole.USER] };
      jest.spyOn(model, 'findById').mockResolvedValue(user as any);

      const result = await service.getUser('1');

      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.getUser('1')).rejects.toThrowError();
    });
  });

  describe('createSystemAdmin', () => {
    it('should create a new system admin', async () => {
      const saveSpy = jest.spyOn(model.prototype, 'save');
  
      await service.createSystemAdmin();
  
      expect(saveSpy).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        password: expect.any(String),
        email: 'johndoe@gmail.com',
        isAuthorized: true,
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return existing user by email', async () => {
      const email = 'test@example.com';
      const existingUser = { email, /* other user properties */ };
      jest.spyOn(model, 'find').mockResolvedValue([existingUser]);

      const result = await service.getUserByEmail(email);

      expect(result).toEqual(existingUser);
    });

    it('should throw BadRequestException if user not found by email', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(model, 'find').mockResolvedValue([]);

      await expect(service.getUserByEmail(email)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user by id', async () => {
      const id = '123';
      const deletedUser = { _id: id, /* other user properties */ };
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(deletedUser);

      await service.deleteUser(id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException if user not found by id', async () => {
      const id = 'nonexistentId';
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(service.deleteUser(id)).rejects.toThrowError(BadRequestException);
    });
  });

  // describe('getUserPage', () => {
  //   it('should return user page', async () => {
  //     const pageRequest: PageRequest = { pageNum: 1, pageSize: 10 }; // Adjusted PageRequest with 'pageNum' and 'pageSize'
  //     const mockUserPage = {
  //       data: [
  //         { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  //         { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  //         // Add more user objects as needed
  //       ],
  //       totalCount: 100, // Total number of users in the database
  //       totalPages: 10, // Total number of pages based on pageSize
  //     };
  //     jest.spyOn(MongooseUtil, 'getDocumentPage').mockResolvedValue(mockUserPage);

  //     const result = await service.getUserPage(pageRequest);

  //     expect(result).toEqual(mockUserPage);
  //   });
  // });

});

