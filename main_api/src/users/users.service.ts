import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { MongooseUtil } from 'src/common/util/mongoose.util';
import { Page, PageUtil } from 'src/common/util/page.util';
import { FlatUser, User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

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

  async getUserByStripeCustomerId(id: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with stripe customer id '${id}'`);
    const existingUser = await this.userModel.findOne({ stripeCustomerId: id });

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with stripe customere id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with stripe customer id '${id}' was not found`,
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

    // TODO: Handle predictions and feedback
  }

  async getUserPage(pageRequest: PageRequest) {
    return await MongooseUtil.getDocumentPage(this.userModel, pageRequest);
  }
}
