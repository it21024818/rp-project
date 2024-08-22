import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, FlatUser } from './user.schema';
import { Model } from 'mongoose';
import { Page, PageUtil } from 'src/common/util/page.util';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { hashSync } from 'bcryptjs';
import { MongooseUtil } from 'src/common/util/mongoose.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    const existingSystemAdmin = this.userModel.findOne({
      roles: { $in: [UserRole.ADMIN] },
    });
    if (existingSystemAdmin === null) {
      this.logger.log('System admin not found. Creating new system admin...');
      this.createSystemAdmin();
    }
  }

  async createSystemAdmin() {
    const systemAdmin = new this.userModel();
    systemAdmin.firstName = 'John';
    systemAdmin.lastName = 'Doe';
    systemAdmin.password = hashSync('password', 10);
    systemAdmin.email = 'johndoe@gmail.com';
    systemAdmin.isAuthorized = true;
    await systemAdmin.save();
    this.logger.log('New system admin created');
  }

  async updateUser(id: string, userDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto);

    if (updatedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    return updatedUser;
  }

  async getUser(id: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const existingUser = await this.userModel.findById(id);

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    return existingUser;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with email '${email}'`);
    const existingUser = (await this.userModel.find({ email })).pop() ?? null;

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with email '${email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with email '${email}' was not found`,
      });
    }

    return existingUser;
  }

  async deleteUser(id: string) {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (deletedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    this.logger.log(`Deleted user with id '${id}'`);
  }

  async getUserPage(pageRequest: PageRequest) {
    return await MongooseUtil.getDocumentPage(this.userModel, pageRequest);
  }

  async assignToRoom(userId: string, roomId: string) {
    const existingUser = await this.getUser(userId);
    if (existingUser.roomIds.includes(roomId)) {
      this.logger.warn(
        `User with id ${userId} has already been added to room with id ${roomId}`,
      );
      throw new ConflictException(
        ErrorMessage.USER_ALREADY_IN_ROOM,
        `User with id ${userId} has already been added to room with id ${roomId}`,
      );
    }

    existingUser.roomIds.push(roomId);
    await existingUser.save();
  }

  async unassignFromRoom(userId: string, roomId: string) {
    const existingUser = await this.getUser(userId);
    if (!existingUser.roomIds.includes(roomId)) {
      this.logger.warn(
        `User with id ${userId} is not assigned to room with id ${roomId}`,
      );
      throw new ConflictException(
        ErrorMessage.USER_NOT_IN_ROOM,
        `User with id ${userId} is not assigned to room with id ${roomId}`,
      );
    }

    existingUser.roomIds =
      existingUser?.roomIds?.filter((id) => id !== roomId) ?? [];
    await existingUser.save();
  }

  async unassignAllFromRoom(roomId: string) {
    const existingUsers = await this.userModel.find({
      roomIds: { $in: [roomId] },
    });
    const updatedUsers = existingUsers.map((user) => {
      user.roomIds = user.roomIds.filter((id) => id !== roomId);
      return user;
    });
    const userPromises = updatedUsers.map(async (user) => user.save());
    return await Promise.all(userPromises);
  }
}
