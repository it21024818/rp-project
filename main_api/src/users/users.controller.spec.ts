import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserPage: jest.fn(),
            getUser: jest.fn(),
            deleteUser: jest.fn(),
            getUserByEmail: jest.fn(),
            assignToRoom: jest.fn(),
            unassignFromRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsersPage', () => {
    it('should call getUserPage method of usersService', async () => {
      const pageRequest: PageRequest = { pageNum: 1, pageSize: 10 };
      await controller.getUsersPage(pageRequest);
      expect(usersService.getUserPage).toHaveBeenCalledWith(pageRequest);
    });
  });

  describe('getUser', () => {
    it('should call getUser method of usersService', async () => {
      const userId = '1';
      await controller.getUser(userId);
      expect(usersService.getUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteUser', () => {
    it('should call deleteUser method of usersService', async () => {
      const userId = '1';
      await controller.deleteUser(userId);
      expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('inviteToRoom', () => {
    it('should call getUserByEmail and assignToRoom methods of usersService', async () => {
      const email = 'test@example.com';
      const roomId = '1';
      await controller.inviteToRoom(email, roomId);
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(usersService.assignToRoom).toHaveBeenCalledWith(expect.any(String), roomId);
    });

    it('should throw BadRequestException if getUserByEmail returns null', async () => {
      const email = 'test@example.com';
      const roomId = '1';
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null as any); // Cast null to any
    
      await expect(controller.inviteToRoom(email, roomId)).rejects.toThrowError(BadRequestException);
    
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(usersService.assignToRoom).not.toHaveBeenCalled(); // Make sure assignToRoom is not called
    });    
    
  });

  describe('unassignFromRoom', () => {
    it('should call unassignFromRoom method of usersService', async () => {
      const userId = '1';
      const roomId = '1';
      await controller.unassignFromRoom(userId, roomId);
      expect(usersService.unassignFromRoom).toHaveBeenCalledWith(userId, roomId);
    });
  });
});

